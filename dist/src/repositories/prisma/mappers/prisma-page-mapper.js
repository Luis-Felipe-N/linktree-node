"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPageMapper = void 0;
const page_entity_1 = require("../../../domain/enterprise/entities/page.entity");
const unique_entity_id_1 = require("../../../core/entities/unique-entity-id");
class PrismaPageMapper {
    /**
     * Converte do modelo Prisma para a entidade de domínio
     */
    static toDomain(raw) {
        return page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(raw.ownerId),
            slug: raw.slug,
            title: raw.title,
            description: raw.description,
            imageUrl: raw.imageUrl,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    /**
     * Converte da entidade de domínio para o modelo Prisma (para criação)
     */
    static toPrisma(page) {
        var _a, _b, _c, _d;
        return {
            id: page.id.toString(),
            ownerId: page.ownerId.toString(),
            slug: page.slug,
            title: (_a = page.title) !== null && _a !== void 0 ? _a : null,
            description: (_b = page.description) !== null && _b !== void 0 ? _b : null,
            imageUrl: (_c = page.imageUrl) !== null && _c !== void 0 ? _c : null,
            createdAt: page.createdAt,
            updatedAt: (_d = page.updatedAt) !== null && _d !== void 0 ? _d : new Date(),
        };
    }
    /**
     * Converte múltiplos registros Prisma para entidades de domínio
     */
    static toDomainList(raw) {
        return raw.map(page => this.toDomain(page));
    }
}
exports.PrismaPageMapper = PrismaPageMapper;
