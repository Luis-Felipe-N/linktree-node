"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPageMapper = void 0;
const page_entity_1 = require("@/domain/enterprise/entities/page.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const prisma_user_mapper_1 = require("./prisma-user-mapper");
const prisma_theme_mapper_1 = require("./prisma-theme-mapper");
const link_entity_1 = require("@/domain/enterprise/entities/link.entity");
const prisma_link_mapper_1 = require("./prisma-link-mapper");
class PrismaPageMapper {
    static toDomain(raw) {
        return page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(raw.ownerId),
            slug: raw.slug,
            title: raw.title,
            description: raw.description,
            imageUrl: raw.imageUrl,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
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
    static toDetails(raw) {
        var _a, _b;
        return page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(raw.ownerId),
            title: raw.title,
            slug: raw.slug,
            description: (_a = raw.description) !== null && _a !== void 0 ? _a : null,
            imageUrl: (_b = raw.imageUrl) !== null && _b !== void 0 ? _b : null,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            owner: prisma_user_mapper_1.PrismaUserMapper.toDomain(raw.owner),
            theme: raw.theme ? prisma_theme_mapper_1.PrismaThemeMapper.toDomain(raw.theme) : undefined,
            links: new link_entity_1.LinkList(raw.links.map(prisma_link_mapper_1.PrismaLinkMapper.toDomain))
        });
    }
    static toDetailsList(raw) {
        return raw.map(page => this.toDetails(page));
    }
}
exports.PrismaPageMapper = PrismaPageMapper;
