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
exports.PrismaLinksRepository = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_link_mapper_1 = require("./mappers/prisma-link-mapper");
class PrismaLinksRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaData = prisma_link_mapper_1.PrismaLinkMapper.toPrisma(data);
            const created = yield prisma_1.prisma.link.create({ data: prismaData });
            return prisma_link_mapper_1.PrismaLinkMapper.toDomain(created);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield prisma_1.prisma.link.findUnique({
                where: { id },
            });
            if (!link)
                return null;
            return prisma_link_mapper_1.PrismaLinkMapper.toDomain(link);
        });
    }
    findByPageId(pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const links = yield prisma_1.prisma.link.findMany({
                where: { pageId },
                orderBy: { order: 'asc' },
            });
            return prisma_link_mapper_1.PrismaLinkMapper.toDomainList(links);
        });
    }
    update(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaData = prisma_link_mapper_1.PrismaLinkMapper.toPrisma(link);
            const { id } = prismaData, dataToUpdate = __rest(prismaData, ["id"]);
            const updated = yield prisma_1.prisma.link.update({
                where: { id },
                data: dataToUpdate,
            });
            return prisma_link_mapper_1.PrismaLinkMapper.toDomain(updated);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.prisma.link.delete({
                where: { id },
            });
        });
    }
    reorderLinks(pageId, linkIds) {
        return __awaiter(this, void 0, void 0, function* () {
            // Update order for each link in a transaction
            yield prisma_1.prisma.$transaction(linkIds.map((linkId, index) => prisma_1.prisma.link.update({
                where: { id: linkId, pageId },
                data: { order: index },
            })));
        });
    }
}
exports.PrismaLinksRepository = PrismaLinksRepository;
