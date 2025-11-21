"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const entity_1 = require("@/core/entities/entity");
class Theme extends entity_1.Entity {
    get pageId() { return this.props.pageId; }
    get background() { return this.props.background; }
    get button() { return this.props.button; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    set background(background) { this.props.background = background; }
    set button(button) { this.props.button = button; }
    set active(active) { this.props.active = active; }
    static create(props, id) {
        var _a, _b, _c, _d;
        const theme = new Theme(Object.assign(Object.assign({}, props), { background: (_a = props.background) !== null && _a !== void 0 ? _a : null, button: (_b = props.button) !== null && _b !== void 0 ? _b : null, active: (_c = props.active) !== null && _c !== void 0 ? _c : true, created_at: (_d = props.created_at) !== null && _d !== void 0 ? _d : new Date() }), id);
        return theme;
    }
}
exports.Theme = Theme;
