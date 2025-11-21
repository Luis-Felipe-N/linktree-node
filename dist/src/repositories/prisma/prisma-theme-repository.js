"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaThemesRepository = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_theme_mapper_1 = require("./mappers/prisma-theme-mapper");
class PrismaThemesRepository {
    create(theme) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = prisma_theme_mapper_1.PrismaThemeMapper.toPrisma(theme);
            yield prisma_1.prisma.theme.create({
                data
            });
            return theme;
        });
    }
    save(theme) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = prisma_theme_mapper_1.PrismaThemeMapper.toPrisma(theme);
            yield prisma_1.prisma.theme.update({
                where: {
                    id: theme.id.toString(),
                },
                data
            });
            return theme;
        });
    }
    findByPageId(pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const theme = yield prisma_1.prisma.theme.findUnique({
                where: { pageId },
                include: {
                    background: true,
                    button: true,
                }
            });
            if (!theme)
                return null;
            return prisma_theme_mapper_1.PrismaThemeMapper.toDomain(theme);
        });
    }
}
exports.PrismaThemesRepository = PrismaThemesRepository;
