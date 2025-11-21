"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maketheme = void 0;
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const theme_entity_1 = require("@/domain/enterprise/entities/theme.entity");
function maketheme(themeData, id) {
    var _a;
    const theme = theme_entity_1.Theme.create({
        pageId: (_a = themeData.pageId) !== null && _a !== void 0 ? _a : new unique_entity_id_1.UniqueEntityID(),
        background: themeData.background,
        button: themeData.button,
        active: themeData.active,
    }, id);
    return theme;
}
exports.maketheme = maketheme;
