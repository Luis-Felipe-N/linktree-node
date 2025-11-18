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
exports.getPageBySlug = void 0;
const zod_1 = require("zod");
const make_get_page_details_use_case_1 = require("@/use-cases/factories/make-get-page-details-use-case");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const page_presenter_1 = require("@/http/presenters/page-presenter");
function getPageBySlug(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getPageBySlugParamsSchema = zod_1.z.object({
            slug: zod_1.z.string().min(3).max(100),
        });
        const validationResult = getPageBySlugParamsSchema.safeParse(request.params);
        if (!validationResult.success) {
            return reply
                .status(400)
                .send({ message: 'Invalid page slug', issues: validationResult.error.format() });
        }
        const { slug } = validationResult.data;
        try {
            const getPageDetailsUseCase = (0, make_get_page_details_use_case_1.makeGetPageDetailsUseCase)();
            const { page } = yield getPageDetailsUseCase.execute({ slug });
            return reply.status(200).send({ page: page_presenter_1.PagePresenter.toHTTPWithOwner(page) });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: 'Page not found.' });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.getPageBySlug = getPageBySlug;
