"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkPresenter = void 0;
class LinkPresenter {
    static toHTTP(link) {
        return {
            id: link.id.toString(),
            pageId: link.pageId.toString(),
            url: link.url,
            order: link.order,
            title: link.title,
            thumbnailUrl: link.thumbnailUrl,
            clickCount: link.clickCount,
            highlightEffect: link.highlightEffect,
            scheduledStart: link.scheduledStart,
            scheduledEnd: link.scheduledEnd,
            type: link.type,
            isLocked: link.isLocked,
            active: link.active,
            created_at: link.created_at,
            updated_at: link.updated_at,
        };
    }
    static toHTTPList(links) {
        return links.map(l => this.toHTTP(l));
    }
}
exports.LinkPresenter = LinkPresenter;
