"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaThemeMapper = void 0;
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const theme_entity_1 = require("@/domain/enterprise/entities/theme.entity");
const prisma_background_mapper_1 = require("./prisma-background-mapper");
const prisma_button_mapper_1 = require("./prisma-button-mapper");
class PrismaThemeMapper {
    static toDomain(raw) {
        return theme_entity_1.Theme.create({
            pageId: new unique_entity_id_1.UniqueEntityID(raw.pageId),
            background: raw.background ? prisma_background_mapper_1.PrismaBackgroundMapper.toDomain(raw.background) : null,
            button: raw.button ? prisma_button_mapper_1.PrismaButtonMapper.toDomain(raw.button) : null,
            active: raw.active,
            created_at: raw.created_at,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(theme) {
        return {
            id: theme.id.toString(),
            pageId: theme.pageId.toString(),
            backgroundId: theme.background ? theme.background.id.toString() : null,
            buttonId: theme.button ? theme.button.id.toString() : null,
            active: theme.active,
            created_at: theme.created_at,
        };
    }
    static toDetails(raw) {
        return {
            id: raw.id,
            key: raw.key,
            editable: raw.editable,
            luminance: raw.luminance,
            typeface: raw.typeface,
            socialStyle: raw.socialStyle,
            heading: raw.heading,
            footer: raw.footer,
            background: raw.background,
            button: raw.button,
        };
    }
}
exports.PrismaThemeMapper = PrismaThemeMapper;
