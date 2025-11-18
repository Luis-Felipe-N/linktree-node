"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdatePageThemeUseCase = void 0;
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const update_page_theme_usecase_1 = require("../update-page-theme.usecase");
function makeUpdatePageThemeUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    return new update_page_theme_usecase_1.UpdatePageThemeUseCase(pagesRepository);
}
exports.makeUpdatePageThemeUseCase = makeUpdatePageThemeUseCase;
