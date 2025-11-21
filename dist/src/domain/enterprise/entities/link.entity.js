"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkList = exports.Link = void 0;
const entity_1 = require("@/core/entities/entity");
const watched_list_1 = require("./watched-list");
class Link extends entity_1.Entity {
    get pageId() { return this.props.pageId; }
    get url() { return this.props.url; }
    get order() { return this.props.order; }
    get title() { return this.props.title; }
    get thumbnailUrl() { return this.props.thumbnailUrl; }
    get clickCount() { return this.props.clickCount; }
    get highlightEffect() { return this.props.highlightEffect; }
    get scheduledStart() { return this.props.scheduledStart; }
    get scheduledEnd() { return this.props.scheduledEnd; }
    get type() { return this.props.type; }
    get isLocked() { return this.props.isLocked; }
    get active() { return this.props.active; }
    get created_at() { return this.props.created_at; }
    get updated_at() { return this.props.updated_at; }
    set url(url) { this.props.url = url; this.touch(); }
    set order(order) { this.props.order = order; this.touch(); }
    set title(title) { this.props.title = title; this.touch(); }
    set thumbnailUrl(url) { this.props.thumbnailUrl = url; this.touch(); }
    set highlightEffect(effect) { this.props.highlightEffect = effect; this.touch(); }
    set scheduledStart(date) { this.props.scheduledStart = date; this.touch(); }
    set scheduledEnd(date) { this.props.scheduledEnd = date; this.touch(); }
    set isLocked(locked) { this.props.isLocked = locked; this.touch(); }
    set active(active) { this.props.active = active; this.touch(); }
    incrementClickCount() {
        this.props.clickCount++;
    }
    touch() {
        this.props.updated_at = new Date();
    }
    static create(props, id) {
        var _a, _b, _c, _d, _e, _f;
        const link = new Link(Object.assign(Object.assign({}, props), { clickCount: (_a = props.clickCount) !== null && _a !== void 0 ? _a : 0, active: (_b = props.active) !== null && _b !== void 0 ? _b : true, type: (_c = props.type) !== null && _c !== void 0 ? _c : 'link', isLocked: (_d = props.isLocked) !== null && _d !== void 0 ? _d : false, created_at: (_e = props.created_at) !== null && _e !== void 0 ? _e : new Date(), updated_at: (_f = props.updated_at) !== null && _f !== void 0 ? _f : null }), id);
        return link;
    }
}
exports.Link = Link;
class LinkList extends watched_list_1.WatchedList {
    compareItems(a, b) {
        return a.id.toString() === b.id.toString();
    }
}
exports.LinkList = LinkList;
