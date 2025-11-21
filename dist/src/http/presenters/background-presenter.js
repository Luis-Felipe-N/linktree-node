"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackgroundPresenter = void 0;
class BackgroundPresenter {
    static toHTTP(background) {
        return {
            id: background.id.toString(),
            imageUrl: background.imageUrl,
            createdAt: background.created_at,
            properties: background.properties,
        };
    }
}
exports.BackgroundPresenter = BackgroundPresenter;
