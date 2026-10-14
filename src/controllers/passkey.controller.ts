import {Body, Controller, Post, Route, Tags, SuccessResponse} from 'tsoa';
import type {
    PasskeyRequest,
    GeneratedPasskeyResult,
    AssertionResponse,
    LoginChallengeRequest
} from '../models/webauthn.dto.js';
import {PasskeyService} from '../services/passkey.service.js';

@Route('api/passkey')
@Tags('Passkey Automation')
export class PasskeyController extends Controller {
    private passkeyService = new PasskeyService();

    /**
     * Принимает publicKey для создания Passkey и генерирует валидный ответ attestationData на лету.
     */
    @Post('generate')
    @SuccessResponse(200, 'OK')
    async generatePasskey(
        @Body() request: PasskeyRequest
    ): Promise<GeneratedPasskeyResult> {
        try {
            const result = this.passkeyService.generatePasskey(request);
            return result;
        } catch (error: any) {
            this.setStatus(400);
            console.error(error);
            throw new Error(`Ошибка генерации Passkey: ${error.message}`);
        }
    }

    /**
     * Принимает новый challenge от МТС и приватный ключ, возвращая готовую структуру для входа.
     */
    @Post('login')
    @SuccessResponse(200, 'OK')
    public async loginPasskey(
        @Body() request: LoginChallengeRequest
    ): Promise<AssertionResponse> {
        try {
            const result = this.passkeyService.generateAssertion(request);
            return result;
        } catch (error: any) {
            this.setStatus(400);
            throw new Error(`Ошибка генерации подписи входа: ${error.message}`);
        }
    }

}