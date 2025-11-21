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
exports.PrismaBackgroundRepository = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_background_mapper_1 = require("./mappers/prisma-background-mapper");
class PrismaBackgroundRepository {
    create(background) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = background.properties || {};
            if (background.color && !properties.backgroundColor) {
                properties.backgroundColor = background.color;
            }
            yield prisma_1.prisma.background.create({
                data: {
                    id: background.id.toString(),
                    type: background.type.toUpperCase(),
                    gradientStart: background.gradientStart,
                    gradientEnd: background.gradientEnd,
                    gradientDirection: background.gradientDirection,
                    imageUrl: background.imageUrl,
                    videoUrl: background.videoUrl,
                    style: background.style,
                    properties: Object.keys(properties).length > 0 ? properties : undefined,
                    active: background.active,
                    created_at: background.created_at,
                }
            });
            return background;
        });
    }
    save(background) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = prisma_background_mapper_1.PrismaBackgroundMapper.toPrisma(background);
            const backgroundUptaded = yield prisma_1.prisma.background.update({
                where: { id: background.id.toString() },
                data
            });
            return prisma_background_mapper_1.PrismaBackgroundMapper.toDomain(backgroundUptaded);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const background = yield prisma_1.prisma.background.findUnique({
                where: { id }
            });
            if (!background) {
                return null;
            }
            return prisma_background_mapper_1.PrismaBackgroundMapper.toDomain(background);
        });
    }
}
exports.PrismaBackgroundRepository = PrismaBackgroundRepository;
