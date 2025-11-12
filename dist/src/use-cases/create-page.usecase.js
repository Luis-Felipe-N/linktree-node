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
exports.CreatePageUseCase = void 0;
const page_entity_1 = require("@/domain/enterprise/entities/page.entity");
const page_slug_already_exists_error_1 = require("./errors/page-slug-already-exists-error");
const resource_not_found_error_1 = require("./errors/resource-not-found-error");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
class CreatePageUseCase {
    constructor(pagesRepository, usersRepository) {
        this.pagesRepository = pagesRepository;
        this.usersRepository = usersRepository;
    }
    execute({ ownerId, slug, title, description, imageUrl, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.usersRepository.findById(ownerId);
            if (!user) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            const existingPage = yield this.pagesRepository.findBySlug(slug);
            if (existingPage) {
                throw new page_slug_already_exists_error_1.PageSlugAlreadyExistsError();
            }
            const page = page_entity_1.Page.create({
                ownerId: new unique_entity_id_1.UniqueEntityID(ownerId),
                slug,
                title,
                description,
                imageUrl,
            });
            yield this.pagesRepository.create(page);
            return { page };
        });
    }
}
exports.CreatePageUseCase = CreatePageUseCase;
