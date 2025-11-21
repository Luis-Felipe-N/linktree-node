"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagePresenter = void 0;
const user_presenter_1 = require("./user-presenter");
const theme_presenter_1 = require("./theme-presenter");
const link_presenter_1 = require("./link-presenter");
class PagePresenter {
    static toHTTP(page) {
        console.log('PagePresenter.toHTTP', page);
        return {
            id: page.id.toString(),
            slug: page.slug,
            title: page.title,
            description: page.description,
            imageUrl: page.imageUrl,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
            owner: page.owner && user_presenter_1.UserPresenter.toHTTP(page.owner),
            theme: page.theme && theme_presenter_1.ThemePresenter.toHTTP(page.theme),
            links: page.links && page.links.getItems().map(link_presenter_1.LinkPresenter.toHTTP),
        };
    }
}
exports.PagePresenter = PagePresenter;
