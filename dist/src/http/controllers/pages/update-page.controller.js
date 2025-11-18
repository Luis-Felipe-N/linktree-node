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
exports.updatePage = void 0;
const zod_1 = require("zod");
const make_update_page_use_case_1 = require("@/use-cases/factories/make-update-page-use-case");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const unauthorized_error_1 = require("@/use-cases/errors/unauthorized-error");
const page_presenter_1 = require("@/http/presenters/page-presenter");
function updatePage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatePageParamsSchema = zod_1.z.object({
            pageId: zod_1.z.string().uuid(),
        });
        const updatePageBodySchema = zod_1.z.object({
            title: zod_1.z.string().min(1).max(100).optional(),
            description: zod_1.z.string().max(500).optional(),
            slug: zod_1.z
                .string()
                .min(3)
                .max(50)
                .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
                .optional(),
        });
        const { pageId } = updatePageParamsSchema.parse(request.params);
        const { title, description, slug } = updatePageBodySchema.parse(request.body);
        const userId = request.user.sub;
        try {
            const updatePageUseCase = (0, make_update_page_use_case_1.makeUpdatePageUseCase)();
            const { page } = yield updatePageUseCase.execute({
                pageId,
                userId,
                title,
                description,
                slug,
            });
            return reply.status(200).send({
                page: page_presenter_1.PagePresenter.toHTTP(page),
            });
        }
        catch (err) {
            if (err instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: err.message });
            }
            if (err instanceof unauthorized_error_1.UnauthorizedError) {
                return reply.status(403).send({ message: err.message });
            }
            throw err;
        }
    });
}
exports.updatePage = updatePage;
