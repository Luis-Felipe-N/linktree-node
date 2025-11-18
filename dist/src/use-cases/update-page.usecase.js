"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePageUseCase = void 0;
const resource_not_found_error_1 = require("./errors/resource-not-found-error");
const unauthorized_error_1 = require("./errors/unauthorized-error");
class UpdatePageUseCase {
    constructor(pagesRepository) {
        this.pagesRepository = pagesRepository;
    }
    execute({ pageId, userId, title, description, slug, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.pagesRepository.findById(pageId);
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            // Verifica se o usuário é dono da página
            if (page.ownerId.toString() !== userId) {
                throw new unauthorized_error_1.UnauthorizedError();
            }
            // Atualiza apenas os campos fornecidos
            if (title !== undefined) {
                page.title = title;
            }
            if (description !== undefined) {
                page.description = description;
            }
            if (slug !== undefined) {
                // Verifica se o slug já está em uso por outra página
                const existingPage = yield this.pagesRepository.findBySlug(slug);
                if (existingPage && existingPage.id.toString() !== pageId) {
                    throw new Error('Slug already in use');
                }
                page.slug = slug;
            }
            const updatedPage = yield this.pagesRepository.save(page);
            return {
                page: updatedPage,
            };
        });
    }
}
exports.UpdatePageUseCase = UpdatePageUseCase;
