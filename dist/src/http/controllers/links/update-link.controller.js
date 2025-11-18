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
exports.updateLink = void 0;
const zod_1 = require("zod");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const unauthorized_error_1 = require("@/use-cases/errors/unauthorized-error");
const link_presenter_1 = require("@/http/presenters/link-presenter");
const make_update_link_use_case_1 = require("@/use-cases/factories/make-update-link-use-case");
function updateLink(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const updateLinkParamsSchema = zod_1.z.object({
            linkId: zod_1.z.string().uuid(),
        });
        const updateLinkBodySchema = zod_1.z.object({
            url: zod_1.z.string().url().optional(),
            title: zod_1.z.string().min(1).max(100).nullable().optional(),
            thumbnailUrl: zod_1.z.string().nullable().optional(),
            highlightEffect: zod_1.z.string().nullable().optional(),
            scheduledStart: zod_1.z.coerce.date().nullable().optional(),
            scheduledEnd: zod_1.z.coerce.date().nullable().optional(),
            active: zod_1.z.boolean().optional(),
            order: zod_1.z.number().int().min(0).optional(),
        });
        const { linkId } = updateLinkParamsSchema.parse(request.params);
        const { url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, active, order } = updateLinkBodySchema.parse(request.body);
        const userId = request.user.sub;
        try {
            const updateLinkUseCase = (0, make_update_link_use_case_1.makeUpdateLinkUseCase)();
            const { link } = yield updateLinkUseCase.execute({
                linkId,
                userId,
                url,
                title,
                thumbnailUrl,
                highlightEffect,
                scheduledStart,
                scheduledEnd,
                active,
                order,
            });
            return reply.status(200).send({
                link: link_presenter_1.LinkPresenter.toHTTP(link),
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
exports.updateLink = updateLink;
