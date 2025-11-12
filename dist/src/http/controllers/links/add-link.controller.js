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
exports.addLink = void 0;
const zod_1 = require("zod");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const unauthorized_error_1 = require("@/use-cases/errors/unauthorized-error");
const link_presenter_1 = require("@/http/presenters/link-presenter");
const make_add_link_to_page_use_case_1 = require("@/use-cases/factories/make-add-link-to-page-use-case");
function addLink(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: 'Unauthorized.' });
        }
        const addLinkParamsSchema = zod_1.z.object({
            pageId: zod_1.z.string().uuid(),
        });
        const addLinkBodySchema = zod_1.z.object({
            url: zod_1.z.string().url({ message: 'Invalid URL format.' }),
            title: zod_1.z.string().max(100).optional(),
            thumbnailUrl: zod_1.z.string().url().optional(),
            highlightEffect: zod_1.z.string().optional(),
            scheduledStart: zod_1.z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
            scheduledEnd: zod_1.z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
            type: zod_1.z.enum(['link', 'embed', 'header']).optional(),
        });
        const paramsValidation = addLinkParamsSchema.safeParse(request.params);
        const bodyValidation = addLinkBodySchema.safeParse(request.body);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() });
        }
        if (!bodyValidation.success) {
            return reply.status(400).send({ message: 'Invalid link data.', issues: bodyValidation.error.format() });
        }
        const { pageId } = paramsValidation.data;
        const { url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, type } = bodyValidation.data;
        try {
            const addLinkUseCase = (0, make_add_link_to_page_use_case_1.makeAddLinkToPageUseCase)();
            const { link } = yield addLinkUseCase.execute({
                userId: request.user.sub,
                pageId,
                url,
                title,
                thumbnailUrl,
                highlightEffect,
                scheduledStart,
                scheduledEnd,
                type,
            });
            return reply.status(201).send({ link: link_presenter_1.LinkPresenter.toHTTP(link) });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: 'Page not found.' });
            }
            if (error instanceof unauthorized_error_1.UnauthorizedError) {
                return reply.status(403).send({ message: 'Forbidden: You do not own this page.' });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.addLink = addLink;
