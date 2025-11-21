"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBackground = void 0;
const background_entity_1 = require("@/domain/enterprise/entities/background.entity");
function makeBackground(data, id) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return background_entity_1.Background.create({
        type: (_a = data.type) !== null && _a !== void 0 ? _a : 'color',
        color: (_b = data.color) !== null && _b !== void 0 ? _b : null,
        gradientStart: (_c = data.gradientStart) !== null && _c !== void 0 ? _c : null,
        gradientEnd: (_d = data.gradientEnd) !== null && _d !== void 0 ? _d : null,
        gradientDirection: (_e = data.gradientDirection) !== null && _e !== void 0 ? _e : null,
        imageUrl: (_f = data.imageUrl) !== null && _f !== void 0 ? _f : null,
        videoUrl: (_g = data.videoUrl) !== null && _g !== void 0 ? _g : null,
        style: (_h = data.style) !== null && _h !== void 0 ? _h : null,
        properties: (_j = data.properties) !== null && _j !== void 0 ? _j : null,
        active: (_k = data.active) !== null && _k !== void 0 ? _k : true,
        created_at: (_l = data.created_at) !== null && _l !== void 0 ? _l : new Date(),
    }, id);
}
exports.makeBackground = makeBackground;
