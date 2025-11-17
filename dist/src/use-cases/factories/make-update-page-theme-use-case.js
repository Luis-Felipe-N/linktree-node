"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUpdatePageThemeUseCase = void 0;
const prisma_theme_repository_1 = require("../../repositories/prisma/prisma-theme-repository");
const prisma_background_repository_1 = require("../../repositories/prisma/prisma-background-repository");
const prisma_button_repository_1 = require("../../repositories/prisma/prisma-button-repository");
function makeUpdatePageThemeUseCase() {
    const themesRepository = new prisma_theme_repository_1.PrismaThemesRepository();
    const pagesRepository = new PrismaPagesRepository();
    const backgroundRepository = new prisma_background_repository_1.PrismaBackgroundRepository();
    const buttonRepository = new prisma_button_repository_1.PrismaButtonRepository();
    const useCase = new UpdatePageThemeUseCase(themesRepository, pagesRepository, backgroundRepository, buttonRepository);
    return useCase;
}
exports.makeUpdatePageThemeUseCase = makeUpdatePageThemeUseCase;
