"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonPresenter = void 0;
class ButtonPresenter {
    static toHTTP(button) {
        return {
            id: button.id.toString(),
            style: button.style,
            createdAt: button.created_at,
            properties: button.properties,
        };
    }
}
exports.ButtonPresenter = ButtonPresenter;
