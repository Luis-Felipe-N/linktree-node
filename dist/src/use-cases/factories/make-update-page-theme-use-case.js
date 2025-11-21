"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdatePageThemeUseCase = void 0;
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository");
const prisma_theme_repository_1 = require("@/repositories/prisma/prisma-theme-repository");
const prisma_background_repository_1 = require("@/repositories/prisma/prisma-background-repository");
const prisma_button_repository_1 = require("@/repositories/prisma/prisma-button-repository");
const update_page_theme_usecase_1 = require("../themes/update-page-theme.usecase");
function makeUpdatePageThemeUseCase() {
    const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
    const backgroundRepository = new prisma_background_repository_1.PrismaBackgroundRepository();
    const buttonRepository = new prisma_button_repository_1.PrismaButtonRepository();
    const themesRepository = new prisma_theme_repository_1.PrismaThemesRepository();
    return new update_page_theme_usecase_1.UpdatePageThemeUseCase(pagesRepository, themesRepository, backgroundRepository, buttonRepository);
}
exports.makeUpdatePageThemeUseCase = makeUpdatePageThemeUseCase;
