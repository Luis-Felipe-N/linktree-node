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
exports.PrismaPagesRepository = void 0;
const prisma_1 = require("@/lib/prisma");
const prisma_page_mapper_1 = require("./mappers/prisma-page-mapper");
class PrismaPagesRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaData = prisma_page_mapper_1.PrismaPageMapper.toPrisma(data);
            const page = yield prisma_1.prisma.page.create({
                data: prismaData,
            });
            return prisma_page_mapper_1.PrismaPageMapper.toDomain(page);
        });
    }
    findBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield prisma_1.prisma.page.findUnique({
                where: { slug },
                include: {
                    links: { where: { active: true }, orderBy: { order: 'asc' } },
                    theme: { include: { background: true, button: true } },
                    owner: true,
                },
            });
            if (!page)
                return null;
            return prisma_page_mapper_1.PrismaPageMapper.toDetails(page);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield prisma_1.prisma.page.findUnique({
                where: { id },
                include: {
                    links: { where: { active: true }, orderBy: { order: 'asc' } },
                    theme: { include: { background: true, button: true } },
                    owner: true,
                }
            });
            if (!page)
                return null;
            return prisma_page_mapper_1.PrismaPageMapper.toDomain(page);
        });
    }
    /**
     * Encontra todas as páginas pertencentes a um usuário específico.
     * @param ownerId - O ID do usuário proprietário.
     * @returns Uma lista de páginas pertencentes ao usuário, ordenadas por data de criação.
     */
    findByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = yield prisma_1.prisma.page.findMany({
                where: { ownerId },
                orderBy: { createdAt: 'asc' },
            });
            return pages.map(prisma_page_mapper_1.PrismaPageMapper.toDomain);
        });
    }
    save(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaData = prisma_page_mapper_1.PrismaPageMapper.toPrisma(page);
            const updatedPage = yield prisma_1.prisma.page.update({
                where: { id: page.id.toString() },
                data: {
                    title: prismaData.title,
                    description: prismaData.description,
                    slug: prismaData.slug,
                    updatedAt: new Date(),
                },
            });
            return prisma_page_mapper_1.PrismaPageMapper.toDomain(updatedPage);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.page.delete({
                where: { id },
            });
        });
    }
}
exports.PrismaPagesRepository = PrismaPagesRepository;
