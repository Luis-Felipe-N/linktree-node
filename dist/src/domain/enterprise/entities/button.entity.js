"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Button = void 0;
const entity_1 = require("../../../core/entities/entity");
class Button extends entity_1.Entity {
    get style() { return this.props.style; }
    get color() { return this.props.color; }
    get text_color() { return this.props.text_color; }
    get fontFamily() { return this.props.fontFamily; }
    get fontWeight() { return this.props.fontWeight; }
    get shadowStyle() { return this.props.shadowStyle; }
    get shadowColor() { return this.props.shadowColor; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    // Setters podem ser adicionados
    static create(props, id) {
        var _a;
        const button = new Button(Object.assign(Object.assign({}, props), { active: (_a = props.active) !== null && _a !== void 0 ? _a : true, created_at: new Date() }), id);
        return button;
    }
}
exports.Button = Button;
