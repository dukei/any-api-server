// services/passkey.service.ts
import crypto from 'crypto';
import * as cbor from 'cbor-x';
import type {
    PublicKeyOptions,
    GeneratedPasskeyResult,
    LoginChallengeRequest,
    AssertionResponse, PasskeyRequest, PasskeyRequestTest
} from '../models/webauthn.dto.js';

// Создаем чистый энкодер без лишних префиксов в начале байтов
const cborEncoder = new cbor.Encoder({
    mapsAsObjects: false, // Обязательно для корректной сборки Map
    useRecords: false
});

export class PasskeyService {
    public generatePasskey(request: PasskeyRequestTest): GeneratedPasskeyResult {
        const rpId = request.publicKey.rp.id;
        const challenge = request.publicKey.challenge;

        let privateKey: crypto.KeyObject;
        let publicKey: crypto.KeyObject;
        let credentialId: Buffer;
        let credentialIdB64Url: string;

        if(request.testCredentialIdUuid){
            const hexUuid = request.testCredentialIdUuid.replace(/-/g, '');
            credentialId = Buffer.from(hexUuid, 'hex');
        }else{
            // Генерируем случайный ID для нового ключа
            credentialId = crypto.randomBytes(16);
        }

        if(request.testKeyValueB64Url){
            const privateKeyBuffer = Buffer.from(request.testKeyValueB64Url, 'base64url');
            privateKey = crypto.createPrivateKey({
                key: privateKeyBuffer,
                format: 'der',
                type: 'sec1'
            });

            // 2. Автоматически извлекаем парный публичный ключ
            publicKey = crypto.createPublicKey(privateKey);
        }else {
            // 1. Генерируем ключевую пару ES256 (-7) как чистые объекты KeyObject
            const keys =  crypto.generateKeyPairSync('ec', {
                namedCurve: 'P-256'
            });
            publicKey = keys.publicKey
            privateKey = keys.privateKey
        }

        credentialIdB64Url = credentialId.toString('base64url');

        // 2. Теперь методы .export() гарантированно существуют для TypeScript:
        const publicKeySpkiB64 = publicKey.export({ type: 'spki', format: 'der' }).toString('base64url');

        const pubKeyDetails = publicKey.export({ format: 'jwk' });

        if (!pubKeyDetails.x || !pubKeyDetails.y) {
            throw new Error('Не удалось извлечь эллиптические координаты ключа');
        }

        const xBuffer = Buffer.from(pubKeyDetails.x, 'base64url');
        const yBuffer = Buffer.from(pubKeyDetails.y, 'base64url');

        // Собираем COSE-структуру публичного ключа (добавлен тип ключа 1 (EC2))
        const coseKeyMap = new Map<number, any>([
            [1, 2], // Ключ 1: Тип ключа = 2 (EC2)
            [3, -7],        // Ключ 3: Алгоритм = -7 (ES256)
            [-1, 1],        // Ключ -1: Кривая = 1 (P-256)
            [-2, xBuffer],  // Ключ -2: X coordinate
            [-3, yBuffer],  // Ключ -3: Y coordinate
        ]);
        const credentialPublicKeyBuffer = cborEncoder.encode(coseKeyMap);

        // 3. Формируем authenticatorData (authData)
        const rpIdHash = crypto.createHash('sha256').update(rpId).digest();

        // Флаги: User Present (0x01) + User Verified (0x04) + Attested Data Present (0x40) = 0x45
        // Но лучше 5D, как у битварден. А вообще, посмотреть можно на https://www.passkeys-debugger.io/
        const flags = Buffer.from([0x5D]);
        const signCount = Buffer.from([0x00, 0x00, 0x00, 0x00]);

        // Случайный AAGUID компании Bitwarden (d548826e-79b4-db40-a3d8-11116f7e8349)
        const aaguid = Buffer.from("d548826e79b4db40a3d811116f7e8349", "hex");

        const credIdLen = Buffer.alloc(2);
        credIdLen.writeUInt16BE(credentialId.length, 0);

        const authenticatorData = Buffer.concat([
            rpIdHash,
            flags,
            signCount,
            aaguid,
            credIdLen,
            credentialId,
            credentialPublicKeyBuffer,
        ]);

        // 4. Формируем clientDataJSON
        const clientData = {
            type: 'webauthn.create',
            challenge: challenge,
            origin: request.origin,
            crossOrigin: false,
        };
        const clientDataJSONBuffer = Buffer.from(JSON.stringify(clientData));

        // 5. Формируем attestationObject в формате 'none'
        const attestationMap = new Map<string, any>([
            ['fmt', 'none'],
            ['attStmt', new Map()],
            ['authData', authenticatorData],
        ]);
        const attestationObjectBuffer = cborEncoder.encode(attestationMap);

        // 6. Собираем финальный DTO-ответ
        return {
            attestationData: {
                id: credentialIdB64Url,
                rawId: credentialIdB64Url,
                response: {
                    attestationObject: attestationObjectBuffer.toString('base64url'),
                    clientDataJSON: clientDataJSONBuffer.toString('base64url'),
                    transports: ['internal', 'hybrid'],
                    publicKeyAlgorithm: -7,
                    publicKey: publicKeySpkiB64,
                    authenticatorData: authenticatorData.toString('base64url'),
                },
                type: 'public-key',
                clientExtensionResults: {},
                authenticatorAttachment: 'platform',
            },
            privateKeyHex: privateKey.export({ type: 'sec1', format: 'der' }).toString('hex'),
        };
    }

    public generateAssertion(request: LoginChallengeRequest): AssertionResponse {
        const { challenge, rpId } = request.publicKey;

        // 1. Формируем clientDataJSON для этапа входа (webauthn.get)
        const clientData = {
            type: 'webauthn.get', // get означает проверку существующего ключа
            challenge: challenge,
            origin: request.origin,
            crossOrigin: false,
        };
        const clientDataJSONBuffer = Buffer.from(JSON.stringify(clientData));
        const clientDataJSONB64Url = clientDataJSONBuffer.toString('base64url');

        // 2. Формируем authenticatorData (Бинарная структура флагов)
        const rpIdHash = crypto.createHash('sha256').update(rpId).digest();

        // Флаги: User Present (0x01) + User Verified (0x04) + 0x08 (BE) + 0x10 (BS) = 0x1D
        // Сообщаем серверу МТС, что "биометрическая проверка пройдена"
        const flags = Buffer.from([0x1D]);

        // По спецификации счетчик (Sign Count) при каждом входе должен увеличиваться.
        // Клиент сам следит за счетчиком и передаёт нам его
        const signCount = Buffer.alloc(4);
        signCount.writeUInt32BE(request.counter, 0);

        const authenticatorData = Buffer.concat([rpIdHash, flags, signCount]);
        const authenticatorDataB64Url = authenticatorData.toString('base64url');

        // 3. Расчет хэша для подписи
        // По стандарту WebAuthn подписывается склейка: authenticatorData + SHA256(clientDataJSON)
        const clientDataHash = crypto.createHash('sha256').update(clientDataJSONBuffer).digest();
        const signatureBase = Buffer.concat([authenticatorData, clientDataHash]);

        // 4. Восстанавливаем приватный ключ из сохраненной строки HEX
        const privateKeyObject = crypto.createPrivateKey({
            key: Buffer.from(request.privateKeyHex, 'hex'),
            format: 'der',
            type: 'sec1',
        });

        // 5. Генерируем криптографическую подпись по алгоритму ECDSA SHA-256 (ES256)
        // Важно: Node.js по умолчанию отдает подпись в формате DER, что и требует WebAuthn
        const signature = crypto.sign('sha256', signatureBase, privateKeyObject);
        const signatureB64Url = signature.toString('base64url');

        // 6. Собираем финальную структуру ответа для МТС
        return {
            id: request.credentialIdB64Url,
            rawId: request.credentialIdB64Url,
            response: {
                authenticatorData: authenticatorDataB64Url,
                clientDataJSON: clientDataJSONB64Url,
                signature: signatureB64Url,
                userHandle: '', // Для МТС можно оставить пустым или передать ID пользователя
            },
            type: 'public-key',
            clientExtensionResults: {},
            authenticatorAttachment: 'platform',
        };
    }

}