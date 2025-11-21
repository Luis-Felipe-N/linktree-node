"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemePresenter = void 0;
const background_presenter_1 = require("./background-presenter");
const button_presenter_1 = require("./button-presenter");
class ThemePresenter {
    static toHTTP(theme) {
        console.log('ThemePresenter.toHTTP called with theme:', theme);
        return {
            id: theme.id.toString(),
            pageId: theme.pageId.toString(),
            background: theme.background ? background_presenter_1.BackgroundPresenter.toHTTP(theme.background) : null,
            button: theme.button ? button_presenter_1.ButtonPresenter.toHTTP(theme.button) : null,
            active: theme.active,
            createdAt: theme.created_at,
        };
    }
    static toHTTPList(themes) {
        return themes.map(theme => this.toHTTP(theme));
    }
}
exports.ThemePresenter = ThemePresenter;
