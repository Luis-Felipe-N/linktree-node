"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBackgroundMapper = void 0;
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const background_entity_1 = require("@/domain/enterprise/entities/background.entity");
const client_1 = require("@prisma/client");
class PrismaBackgroundMapper {
    static toDomain(raw) {
        const properties = raw.properties || {};
        return background_entity_1.Background.create({
            type: raw.type,
            color: properties.backgroundColor || null,
            gradientStart: raw.gradientStart,
            gradientEnd: raw.gradientEnd,
            gradientDirection: raw.gradientDirection,
            imageUrl: raw.imageUrl,
            videoUrl: raw.videoUrl,
            style: raw.style,
            properties,
            active: raw.active,
            created_at: raw.created_at,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(background) {
        var _a;
        const properties = Object.assign({}, ((_a = background.properties) !== null && _a !== void 0 ? _a : {}));
        if (background.color) {
            properties.backgroundColor = background.color;
        }
        return {
            id: background.id.toString(),
            type: background.type,
            gradientStart: background.gradientStart,
            gradientEnd: background.gradientEnd,
            gradientDirection: background.gradientDirection,
            imageUrl: background.imageUrl,
            videoUrl: background.videoUrl,
            style: background.style,
            properties: Object.keys(properties).length > 0 ? properties : client_1.Prisma.JsonNull,
            active: background.active,
            created_at: background.created_at,
        };
    }
}
exports.PrismaBackgroundMapper = PrismaBackgroundMapper;
