"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePresenter = void 0;
class PagePresenter {
    /**
     * Apresenta uma página sem incluir o ownerId
     * Usado para respostas públicas ou quando o owner já é conhecido
     */
    static toHTTP(page) {
        return {
            id: page.id.toString(),
            slug: page.slug,
            title: page.title,
            description: page.description,
            imageUrl: page.imageUrl,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
        };
    }
    /**
     * Apresenta uma página incluindo o ownerId
     * Usado quando o owner precisa ser conhecido (listagens, etc)
     */
    static toHTTPWithOwner(page) {
        return {
            id: page.id.toString(),
            ownerId: page.ownerId.toString(),
            slug: page.slug,
            title: page.title,
            description: page.description,
            imageUrl: page.imageUrl,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
        };
    }
    /**
     * Apresenta múltiplas páginas
     */
    static toHTTPList(pages) {
        return pages.map(page => this.toHTTP(page));
    }
    /**
     * Apresenta múltiplas páginas com ownerId
     */
    static toHTTPListWithOwner(pages) {
        return pages.map(page => this.toHTTPWithOwner(page));
    }
}
exports.PagePresenter = PagePresenter;
