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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
    /**
     * Encontra uma página pelo seu slug único, incluindo detalhes relacionados.
     * @param slug - O slug da página a ser encontrada.
     * @returns A página com detalhes (links, tema, dono) ou null se não encontrada.
     */
    findBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield prisma_1.prisma.page.findUnique({
                where: { slug },
                include: {
                    // Inclui links ativos, ordenados pela propriedade 'order'
                    links: { where: { active: true }, orderBy: { order: 'asc' } },
                    // Inclui o tema associado, com seus detalhes de background e button
                    theme: { include: { background: true, button: true } },
                    // Inclui informações públicas selecionadas do proprietário
                    owner: { select: { username: true, id: true } },
                },
            });
            if (!page)
                return null;
            return prisma_page_mapper_1.PrismaPageMapper.toDomain(page);
        });
    }
    /**
     * Encontra uma página pelo seu ID.
     * @param id - O ID da página a ser encontrada.
     * @returns A página encontrada ou null se não encontrada.
     */
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield prisma_1.prisma.page.findUnique({
                where: { id },
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
                orderBy: { createdAt: 'asc' }, // Ordena as páginas do usuário
            });
            return prisma_page_mapper_1.PrismaPageMapper.toDomainList(pages);
        });
    }
    /**
     * Atualiza os dados de uma página existente.
     * @param pageData - Um objeto contendo o ID da página e os campos a serem atualizados.
     * @returns A página atualizada.
     */
    save(pageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = pageData, dataToUpdate = __rest(pageData, ["id"]); // Separa o ID dos dados de atualização
            const updatedPage = yield prisma_1.prisma.page.update({
                where: { id },
                data: dataToUpdate,
            });
            return updatedPage;
        });
    }
    /**
     * Deleta uma página pelo seu ID.
     * ATENÇÃO: Isso também pode deletar dados relacionados em cascata, dependendo da configuração do schema.
     * @param id - O ID da página a ser deletada.
     */
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adicionar lógica transacional se necessário para deletar dependências
            // como Links e Theme antes, se não houver cascade delete configurado.
            yield prisma_1.prisma.page.delete({
                where: { id },
            });
        });
    }
}
exports.PrismaPagesRepository = PrismaPagesRepository;
