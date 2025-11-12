"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeRegisterUseCase = void 0;
const prisma_user_repository_1 = require("../../repositories/prisma/prisma-user-repository");
const register_usecase_1 = require("../register.usecase");
function makeRegisterUseCase() {
    const usersRepository = new prisma_user_repository_1.PrismaUsersRepository();
    const useCase = new register_usecase_1.RegisterUseCase(usersRepository);
    return useCase;
}
exports.makeRegisterUseCase = makeRegisterUseCase;
