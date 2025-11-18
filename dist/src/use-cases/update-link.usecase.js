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
exports.UpdateLinkUseCase = void 0;
const resource_not_found_error_1 = require("./errors/resource-not-found-error");
const unauthorized_error_1 = require("./errors/unauthorized-error");
class UpdateLinkUseCase {
    constructor(linksRepository, pagesRepository) {
        this.linksRepository = linksRepository;
        this.pagesRepository = pagesRepository;
    }
    execute({ linkId, userId, url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, active, order, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const link = yield this.linksRepository.findById(linkId);
            if (!link) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            // Verifica se o usuário é dono da página à qual o link pertence
            const page = yield this.pagesRepository.findById(link.pageId.toString());
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            if (page.ownerId.toString() !== userId) {
                throw new unauthorized_error_1.UnauthorizedError();
            }
            // Atualiza apenas os campos fornecidos
            if (url !== undefined)
                link.url = url;
            if (title !== undefined)
                link.title = title;
            if (thumbnailUrl !== undefined)
                link.thumbnailUrl = thumbnailUrl;
            if (highlightEffect !== undefined)
                link.highlightEffect = highlightEffect;
            if (scheduledStart !== undefined)
                link.scheduledStart = scheduledStart;
            if (scheduledEnd !== undefined)
                link.scheduledEnd = scheduledEnd;
            if (active !== undefined)
                link.active = active;
            if (order !== undefined)
                link.order = order;
            const updatedLink = yield this.linksRepository.update(link);
            return {
                link: updatedLink,
            };
        });
    }
}
exports.UpdateLinkUseCase = UpdateLinkUseCase;
