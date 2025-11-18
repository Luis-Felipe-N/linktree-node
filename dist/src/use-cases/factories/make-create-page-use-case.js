"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePageUseCase = void 0;
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const prisma_user_repository_1 = require("@/repositories/prisma/prisma-user-repository");
const create_page_usecase_1 = require("../create-page.usecase");
function makeCreatePageUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const usersRepository = new prisma_user_repository_1.PrismaUsersRepository();
    const useCase = new create_page_usecase_1.CreatePageUseCase(pagesRepository, usersRepository);
    return useCase;
}
exports.makeCreatePageUseCase = makeCreatePageUseCase;
