"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserPagesUseCase = void 0;
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const get_user_pages_usecase_1 = require("../get-user-pages.usecase");
function makeGetUserPagesUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const useCase = new get_user_pages_usecase_1.GetUserPagesUseCase(pagesRepository);
    return useCase;
}
exports.makeGetUserPagesUseCase = makeGetUserPagesUseCase;
