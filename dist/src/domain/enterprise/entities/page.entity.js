"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const entity_1 = require("@/core/entities/entity");
class Page extends entity_1.Entity {
    get ownerId() { return this.props.ownerId; }
    get slug() { return this.props.slug; }
    get title() { return this.props.title; }
    get description() { return this.props.description; }
    get imageUrl() { return this.props.imageUrl; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    get owner() { return this.props.owner; }
    get theme() { return this.props.theme; }
    get links() { return this.props.links; }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        var _a;
        const page = new Page(Object.assign(Object.assign({}, props), { createdAt: (_a = props.createdAt) !== null && _a !== void 0 ? _a : new Date(), updatedAt: null }), id);
        return page;
    }
}
exports.Page = Page;
