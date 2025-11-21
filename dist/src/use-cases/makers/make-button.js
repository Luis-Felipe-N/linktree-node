"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeButton = void 0;
const button_entity_1 = require("@/domain/enterprise/entities/button.entity");
function makeButton(data, id) {
    var _a, _b, _c, _d;
    return button_entity_1.Button.create({
        style: (_a = data.style) !== null && _a !== void 0 ? _a : 'filled',
        properties: (_b = data.properties) !== null && _b !== void 0 ? _b : null,
        active: (_c = data.active) !== null && _c !== void 0 ? _c : true,
        created_at: (_d = data.created_at) !== null && _d !== void 0 ? _d : new Date(),
    }, id);
}
exports.makeButton = makeButton;
