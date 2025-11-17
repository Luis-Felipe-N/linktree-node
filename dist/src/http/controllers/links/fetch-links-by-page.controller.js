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
exports.fetchLinksByPage = void 0;
const zod_1 = require("zod");
const resource_not_found_error_1 = require("../../../use-cases/errors/resource-not-found-error");
const link_presenter_1 = require("../../presenters/link-presenter");
const make_fetch_links_by_page_use_case_1 = require("../../../use-cases/factories/make-fetch-links-by-page-use-case");
function fetchLinksByPage(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const fetchLinksParamsSchema = zod_1.z.object({
            pageId: zod_1.z.string().uuid(),
        });
        const paramsValidation = fetchLinksParamsSchema.safeParse(request.params);
        if (!paramsValidation.success) {
            return reply.status(400).send({
                message: 'Invalid page ID.',
                issues: paramsValidation.error.format()
            });
        }
        const { pageId } = paramsValidation.data;
        try {
            const fetchLinksByPageUseCase = (0, make_fetch_links_by_page_use_case_1.makeFetchLinksByPageUseCase)();
            const { links } = yield fetchLinksByPageUseCase.execute({ pageId });
            return reply.status(200).send({
                links: link_presenter_1.LinkPresenter.toHTTPList(links)
            });
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
exports.fetchLinksByPage = fetchLinksByPage;
