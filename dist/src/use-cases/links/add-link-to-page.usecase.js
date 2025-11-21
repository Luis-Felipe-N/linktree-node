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
exports.AddLinkToPageUseCase = void 0;
const link_entity_1 = require("@/domain/enterprise/entities/link.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../errors/resource-not-found-error");
const unauthorized_error_1 = require("../errors/unauthorized-error");
class AddLinkToPageUseCase {
    constructor(linksRepository, pagesRepository) {
        this.linksRepository = linksRepository;
        this.pagesRepository = pagesRepository;
    }
    execute({ userId, pageId, url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, type, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar se a página existe
            const page = yield this.pagesRepository.findById(pageId);
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            // Verificar se o usuário é o dono da página
            if (page.ownerId.toString() !== userId) {
                throw new unauthorized_error_1.UnauthorizedError();
            }
            // Buscar links existentes para determinar a ordem
            const existingLinks = yield this.linksRepository.findByPageId(pageId);
            const nextOrder = existingLinks.length;
            // Criar o novo link
            const link = link_entity_1.Link.create({
                pageId: new unique_entity_id_1.UniqueEntityID(pageId),
                url,
                title,
                thumbnailUrl,
                highlightEffect,
                scheduledStart,
                scheduledEnd,
                type,
                order: nextOrder,
            });
            const createdLink = yield this.linksRepository.create(link);
            return {
                link: createdLink,
            };
        });
    }
}
exports.AddLinkToPageUseCase = AddLinkToPageUseCase;
