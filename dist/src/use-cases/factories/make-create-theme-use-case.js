"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateThemeUseCase = void 0;
const prisma_theme_repository_1 = require("@/repositories/prisma/prisma-theme-repository");
const create_theme_usecase_1 = require("../create-theme.usecase");
function makeCreateThemeUseCase() {
    const themesRepository = new prisma_theme_repository_1.PrismaThemesRepository();
    const useCase = new create_theme_usecase_1.CreateThemeUseCase(themesRepository);
    return useCase;
}
exports.makeCreateThemeUseCase = makeCreateThemeUseCase;
