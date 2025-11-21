"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const entity_1 = require("@/core/entities/entity");
class Button extends entity_1.Entity {
    get style() { return this.props.style; }
    get properties() { return this.props.properties; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    static create(props, id) {
        var _a, _b;
        const button = new Button(Object.assign(Object.assign({}, props), { active: (_a = props.active) !== null && _a !== void 0 ? _a : true, created_at: (_b = props.created_at) !== null && _b !== void 0 ? _b : new Date() }), id);
        return button;
    }
}
exports.Button = Button;
