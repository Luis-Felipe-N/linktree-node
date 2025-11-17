"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const zod_1 = require("zod");
const invalid_credentials_error_1 = require("../../../use-cases/errors/invalid-credentials-error");
const make_authenticate_use_case_1 = require("../../../use-cases/factories/make-authenticate-use-case");
function authenticate(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticateBodySchema = zod_1.z.object({
            username: zod_1.z.string(),
            password: zod_1.z.string().min(6),
        });
        const { username, password } = authenticateBodySchema.parse(request.body);
        try {
            const authenticateUseCase = (0, make_authenticate_use_case_1.makeAuthenticateUseCase)();
            const { user } = yield authenticateUseCase.execute({ username, password });
            const token = yield reply.jwtSign({ sub: user.id.toString() });
            return reply.status(200).send({
                token,
            });
        }
        catch (error) {
            if (error instanceof invalid_credentials_error_1.InvalidCredentialsError) {
                return reply.status(400).send({ message: error.message });
            }
            throw error;
        }
    });
}
exports.authenticate = authenticate;
