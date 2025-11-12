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
exports.updateTheme = void 0;
const zod_1 = require("zod");
const make_update_page_theme_use_case_1 = require("@/use-cases/factories/make-update-page-theme-use-case");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
const prisma_page_repository_1 = require("@/repositories/prisma/prisma-page-repository"); // Para verificar propriedade
function updateTheme(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: 'Unauthorized.' });
        }
        const updateThemeParamsSchema = zod_1.z.object({
            pageId: zod_1.z.string().uuid(),
        });
        // Schema permite que IDs sejam null ou não enviados (undefined)
        const updateThemeBodySchema = zod_1.z.object({
            themeTitle: zod_1.z.string().min(1).max(50),
            backgroundId: zod_1.z.string().uuid().nullable().optional(),
            buttonId: zod_1.z.string().uuid().nullable().optional(),
        });
        const paramsValidation = updateThemeParamsSchema.safeParse(request.params);
        const bodyValidation = updateThemeBodySchema.safeParse(request.body);
        if (!paramsValidation.success) {
            return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() });
        }
        if (!bodyValidation.success) {
            return reply.status(400).send({ message: 'Invalid theme data.', issues: bodyValidation.error.format() });
        }
        const { pageId } = paramsValidation.data;
        const { themeTitle, backgroundId, buttonId } = bodyValidation.data;
        try {
            // --- Verificação de Propriedade ---
            const pagesRepository = new prisma_page_repository_1.PrismaPagesRepository();
            const page = yield pagesRepository.findById(pageId);
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError('Page not found.'); // Erro específico
            }
            if (page.ownerId !== request.user.sub) {
                return reply.status(403).send({ message: 'Forbidden: You do not own this page.' });
            }
            // --- Fim Verificação ---
            const updateThemeUseCase = (0, make_update_page_theme_use_case_1.makeUpdatePageThemeUseCase)();
            const { theme } = yield updateThemeUseCase.execute({
                pageId,
                themeTitle,
                backgroundId: backgroundId,
                buttonId: buttonId, // Passa null, undefined ou o ID
            });
            return reply.status(200).send({ theme });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                // O erro pode vir da verificação da página, background ou button
                return reply.status(404).send({ message: error.message });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.updateTheme = updateTheme;
