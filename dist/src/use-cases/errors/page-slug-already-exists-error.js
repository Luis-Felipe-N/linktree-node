"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageSlugAlreadyExistsError = void 0;
class PageSlugAlreadyExistsError extends Error {
    constructor() {
        super('Page slug already exists.');
    }
}
exports.PageSlugAlreadyExistsError = PageSlugAlreadyExistsError;
