"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaButtonMapper = void 0;
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const button_entity_1 = require("@/domain/enterprise/entities/button.entity");
class PrismaButtonMapper {
    static toDomain(raw) {
        if (!raw) {
            return null;
        }
        const properties = raw.properties || {};
        return button_entity_1.Button.create({
            style: raw.style,
            properties,
            active: raw.active,
            created_at: raw.created_at,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(button) {
        return {
            id: button.id.toString(),
            style: button.style,
            properties: button.properties || {},
            active: button.active,
            created_at: button.created_at,
        };
    }
}
exports.PrismaButtonMapper = PrismaButtonMapper;
