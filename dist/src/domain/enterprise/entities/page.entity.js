"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
const entity_1 = require("../../../core/entities/entity");
class Page extends entity_1.Entity {
    get ownerId() { return this.props.ownerId; }
    get slug() { return this.props.slug; }
    get title() { return this.props.title; }
    get description() { return this.props.description; }
    get imageUrl() { return this.props.imageUrl; }
    get createdAt() { return this.props.createdAt; }
    get updatedAt() { return this.props.updatedAt; }
    set slug(slug) { this.props.slug = slug; this.touch(); }
    set title(title) { this.props.title = title; this.touch(); }
    set description(description) { this.props.description = description; this.touch(); }
    set imageUrl(url) { this.props.imageUrl = url; this.touch(); }
    touch() {
        this.props.updatedAt = new Date();
    }
    static create(props, id) {
        const page = new Page(Object.assign(Object.assign({}, props), { createdAt: new Date(), updatedAt: null }), id);
        return page;
    }
}
exports.Page = Page;
