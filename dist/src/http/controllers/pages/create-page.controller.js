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
exports.createPage = void 0;
const zod_1 = require("zod");
const make_create_page_use_case_1 = require("@/use-cases/factories/make-create-page-use-case");
const page_slug_already_exists_error_1 = require("@/use-cases/errors/page-slug-already-exists-error");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const page_presenter_1 = require("@/http/presenters/page-presenter");
function createPage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: 'Unauthorized.' });
        }
        const createPageBodySchema = zod_1.z.object({
            slug: zod_1.z
                .string()
                .min(3)
                .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
            title: zod_1.z.string().optional(),
            description: zod_1.z.string().max(160).optional(),
            imageUrl: zod_1.z.string().url().optional(),
        });
        const validationResult = createPageBodySchema.safeParse(request.body);
        if (!validationResult.success) {
            return reply
                .status(400)
                .send({ message: 'Validation Error', issues: validationResult.error.format() });
        }
        const { slug, title, description, imageUrl } = validationResult.data;
        try {
            const createPageUseCase = (0, make_create_page_use_case_1.makeCreatePageUseCase)();
            const { page } = yield createPageUseCase.execute({
                ownerId: request.user.sub,
                slug,
                title,
                description,
                imageUrl,
            });
            return reply.status(201).send({ page: page_presenter_1.PagePresenter.toHTTP(page) });
        }
        catch (error) {
            if (error instanceof page_slug_already_exists_error_1.PageSlugAlreadyExistsError) {
                return reply.status(409).send({ message: error.message });
            }
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                console.error('Owner user not found during page creation:', request.user.sub);
                return reply.status(404).send({ message: 'Owner user not found.' });
            }
            console.error(error); // Log erro interno
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.createPage = createPage;
