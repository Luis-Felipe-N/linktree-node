"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthenticateUseCase = void 0;
const prisma_user_repository_1 = require("../../repositories/prisma/prisma-user-repository");
const authenticate_usecase_1 = require("../users/authenticate.usecase");
function makeAuthenticateUseCase() {
    const usersRepository = new prisma_user_repository_1.PrismaUsersRepository();
    const useCase = new authenticate_usecase_1.AuthenticateUseCase(usersRepository);
    return useCase;
}
exports.makeAuthenticateUseCase = makeAuthenticateUseCase;
