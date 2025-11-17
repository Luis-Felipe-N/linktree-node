"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Background = void 0;
const entity_1 = require("../../../core/entities/entity");
class Background extends entity_1.Entity {
    get type() { return this.props.type; }
    get color() { return this.props.color; }
    get gradientStart() { return this.props.gradientStart; }
    get gradientEnd() { return this.props.gradientEnd; }
    get gradientDirection() { return this.props.gradientDirection; }
    get imageUrl() { return this.props.imageUrl; }
    get videoUrl() { return this.props.videoUrl; }
    get style() { return this.props.style; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    // Setters podem ser adicionados se houver regras de negócio complexas
    static create(props, id) {
        var _a;
        // TODO: Adicionar validação (ex: se type='color', color não pode ser nulo)
        const background = new Background(Object.assign(Object.assign({}, props), { active: (_a = props.active) !== null && _a !== void 0 ? _a : true, created_at: new Date() }), id);
        return background;
    }
}
exports.Background = Background;
