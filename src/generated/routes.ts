/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PasskeyController } from './../controllers/passkey.controller.js';
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';



// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "Record_string.any_": {
        "dataType": "refAlias",
        "type": {"dataType":"nestedObjectLiteral","nestedProperties":{},"additionalProperties":{"dataType":"any"},"validators":{}},
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AttestationResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "rawId": {"dataType":"string","required":true},
            "response": {"dataType":"nestedObjectLiteral","nestedProperties":{"authenticatorData":{"dataType":"string","required":true},"publicKey":{"dataType":"string","required":true},"publicKeyAlgorithm":{"dataType":"double","required":true},"transports":{"dataType":"array","array":{"dataType":"string"},"required":true},"clientDataJSON":{"dataType":"string","required":true},"attestationObject":{"dataType":"string","required":true}},"required":true},
            "type": {"dataType":"enum","enums":["public-key"],"required":true},
            "clientExtensionResults": {"ref":"Record_string.any_","required":true},
            "authenticatorAttachment": {"dataType":"enum","enums":["platform"],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GeneratedPasskeyResult": {
        "dataType": "refObject",
        "properties": {
            "attestationData": {"ref":"AttestationResponse","required":true},
            "privateKeyHex": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "Rp": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "User": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "displayName": {"dataType":"string","required":true},
            "id": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PubKeyCredParam": {
        "dataType": "refObject",
        "properties": {
            "type": {"dataType":"enum","enums":["public-key"],"required":true},
            "alg": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AuthenticatorSelection": {
        "dataType": "refObject",
        "properties": {
            "authenticatorAttachment": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["platform"]},{"dataType":"enum","enums":["cross-platform"]}]},
            "requireResidentKey": {"dataType":"boolean"},
            "residentKey": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["required"]},{"dataType":"enum","enums":["preferred"]},{"dataType":"enum","enums":["discouraged"]}]},
            "userVerification": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["required"]},{"dataType":"enum","enums":["preferred"]},{"dataType":"enum","enums":["discouraged"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PublicKeyOptions": {
        "dataType": "refObject",
        "properties": {
            "rp": {"ref":"Rp","required":true},
            "user": {"ref":"User","required":true},
            "challenge": {"dataType":"string","required":true},
            "pubKeyCredParams": {"dataType":"array","array":{"dataType":"refObject","ref":"PubKeyCredParam"},"required":true},
            "timeout": {"dataType":"double"},
            "authenticatorSelection": {"ref":"AuthenticatorSelection"},
            "attestation": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["none"]},{"dataType":"enum","enums":["indirect"]},{"dataType":"enum","enums":["direct"]},{"dataType":"enum","enums":["enterprise"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "PasskeyRequest": {
        "dataType": "refObject",
        "properties": {
            "publicKey": {"ref":"PublicKeyOptions","required":true},
            "origin": {"dataType":"string","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "AssertionResponse": {
        "dataType": "refObject",
        "properties": {
            "id": {"dataType":"string","required":true},
            "rawId": {"dataType":"string","required":true},
            "response": {"dataType":"nestedObjectLiteral","nestedProperties":{"userHandle":{"dataType":"string"},"signature":{"dataType":"string","required":true},"clientDataJSON":{"dataType":"string","required":true},"authenticatorData":{"dataType":"string","required":true}},"required":true},
            "type": {"dataType":"enum","enums":["public-key"],"required":true},
            "clientExtensionResults": {"ref":"Record_string.any_","required":true},
            "authenticatorAttachment": {"dataType":"enum","enums":["platform"],"required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginChallengeOptions": {
        "dataType": "refObject",
        "properties": {
            "challenge": {"dataType":"string","required":true},
            "timeout": {"dataType":"double"},
            "rpId": {"dataType":"string","required":true},
            "userVerification": {"dataType":"union","subSchemas":[{"dataType":"enum","enums":["required"]},{"dataType":"enum","enums":["preferred"]},{"dataType":"enum","enums":["discouraged"]}]},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginChallengeRequest": {
        "dataType": "refObject",
        "properties": {
            "publicKey": {"ref":"LoginChallengeOptions","required":true},
            "privateKeyHex": {"dataType":"string","required":true},
            "credentialIdB64Url": {"dataType":"string","required":true},
            "origin": {"dataType":"string","required":true},
            "counter": {"dataType":"double","required":true},
        },
        "additionalProperties": true,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"ignore","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsPasskeyController_generatePasskey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"PasskeyRequest"},
        };
        app.post('/api/passkey/generate',
            ...(fetchMiddlewares<RequestHandler>(PasskeyController)),
            ...(fetchMiddlewares<RequestHandler>(PasskeyController.prototype.generatePasskey)),

            async function PasskeyController_generatePasskey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPasskeyController_generatePasskey, request, response });

                const controller = new PasskeyController();

              await templateService.apiHandler({
                methodName: 'generatePasskey',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsPasskeyController_loginPasskey: Record<string, TsoaRoute.ParameterSchema> = {
                request: {"in":"body","name":"request","required":true,"ref":"LoginChallengeRequest"},
        };
        app.post('/api/passkey/login',
            ...(fetchMiddlewares<RequestHandler>(PasskeyController)),
            ...(fetchMiddlewares<RequestHandler>(PasskeyController.prototype.loginPasskey)),

            async function PasskeyController_loginPasskey(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsPasskeyController_loginPasskey, request, response });

                const controller = new PasskeyController();

              await templateService.apiHandler({
                methodName: 'loginPasskey',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: 200,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
