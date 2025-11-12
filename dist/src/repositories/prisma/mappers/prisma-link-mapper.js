"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaLinkMapper = void 0;
const link_entity_1 = require("@/domain/enterprise/entities/link.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
class PrismaLinkMapper {
    static toDomain(raw) {
        return link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID(raw.pageId),
            url: raw.url,
            order: raw.order,
            title: raw.title,
            thumbnailUrl: raw.thumbnailUrl,
            clickCount: raw.clickCount,
            highlightEffect: raw.highlightEffect,
            scheduledStart: raw.scheduledStart,
            scheduledEnd: raw.scheduledEnd,
            type: raw.type,
            isLocked: raw.isLocked,
            active: raw.active,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(link) {
        var _a, _b, _c, _d, _e, _f;
        return {
            id: link.id.toString(),
            pageId: link.pageId.toString(),
            url: link.url,
            order: link.order,
            title: (_a = link.title) !== null && _a !== void 0 ? _a : null,
            thumbnailUrl: (_b = link.thumbnailUrl) !== null && _b !== void 0 ? _b : null,
            clickCount: link.clickCount,
            highlightEffect: (_c = link.highlightEffect) !== null && _c !== void 0 ? _c : null,
            scheduledStart: (_d = link.scheduledStart) !== null && _d !== void 0 ? _d : null,
            scheduledEnd: (_e = link.scheduledEnd) !== null && _e !== void 0 ? _e : null,
            type: link.type,
            isLocked: link.isLocked,
            active: link.active,
            created_at: link.created_at,
            updated_at: (_f = link.updated_at) !== null && _f !== void 0 ? _f : new Date(),
        };
    }
    static toDomainList(raw) {
        return raw.map(l => this.toDomain(l));
    }
}
exports.PrismaLinkMapper = PrismaLinkMapper;
