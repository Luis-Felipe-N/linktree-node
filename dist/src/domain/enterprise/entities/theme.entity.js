"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Theme = void 0;
const entity_1 = require("@/core/entities/entity");
class Theme extends entity_1.Entity {
    get pageId() { return this.props.pageId; }
    get title() { return this.props.title; }
    get backgroundId() { return this.props.backgroundId; }
    get buttonId() { return this.props.buttonId; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    set title(title) { this.props.title = title; }
    set backgroundId(id) { this.props.backgroundId = id; }
    set buttonId(id) { this.props.buttonId = id; }
    set active(active) { this.props.active = active; }
    static create(props, id) {
        var _a;
        const theme = new Theme(Object.assign(Object.assign({}, props), { active: (_a = props.active) !== null && _a !== void 0 ? _a : true, created_at: new Date() }), id);
        return theme;
    }
}
exports.Theme = Theme;
