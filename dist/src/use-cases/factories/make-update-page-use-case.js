"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdatePageUseCase = void 0;
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const update_page_usecase_1 = require("../update-page.usecase");
function makeUpdatePageUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const updatePageUseCase = new update_page_usecase_1.UpdatePageUseCase(pagesRepository);
    return updatePageUseCase;
}
exports.makeUpdatePageUseCase = makeUpdatePageUseCase;
