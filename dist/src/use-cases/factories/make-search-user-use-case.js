"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSearchUserUseCase = void 0;
const prisma_user_repository_1 = require("../../repositories/prisma/prisma-user-repository");
const search_user_usecase_1 = require("../search-user.usecase");
function makeSearchUserUseCase() {
    const usersRepository = new prisma_user_repository_1.PrismaUsersRepository();
    const useCase = new search_user_usecase_1.SearchUserUseCase(usersRepository);
    return useCase;
}
exports.makeSearchUserUseCase = makeSearchUserUseCase;
