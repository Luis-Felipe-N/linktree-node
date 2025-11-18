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
exports.applyThemePreset = void 0;
const zod_1 = require("zod");
const prisma_1 = require("@/lib/prisma");
const theme_preset_helpers_1 = require("@/lib/theme-preset-helpers");
const resource_not_found_error_1 = require("@/use-cases/errors/resource-not-found-error");
/**
 * POST /pages/:pageId/theme/preset
 *
 * Aplica um preset de tema completo (do frontend) a uma página.
 * Recebe um objeto AppearanceTheme e cria os registros Background, Button e Theme.
 *
 * Body: { preset: AppearanceTheme, title: string }
 */
function applyThemePreset(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        // Verificar autenticação
        // @ts-expect-error - JWT plugin adds user to request
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: 'Unauthorized.' });
        }
        const paramsSchema = zod_1.z.object({
            pageId: zod_1.z.string().uuid(),
        });
        // Schema para validar o preset recebido do frontend
        const bodySchema = zod_1.z.object({
            title: zod_1.z.string().min(1).max(100),
            preset: zod_1.z.object({
                key: zod_1.z.string().optional(),
                editable: zod_1.z.boolean().optional(),
                luminance: zod_1.z.enum(['LIGHT', 'DARK']).optional(),
                background: zod_1.z
                    .object({
                    type: zod_1.z.string().optional(),
                    color: zod_1.z.string().optional(),
                    style: zod_1.z.string().optional(),
                    gradientStart: zod_1.z.string().optional(),
                    gradientEnd: zod_1.z.string().optional(),
                    gradientDirection: zod_1.z.string().optional(),
                    imageUrl: zod_1.z.string().optional(),
                    videoUrl: zod_1.z.string().optional(),
                    className: zod_1.z.string().optional(),
                    properties: zod_1.z.record(zod_1.z.any()).optional(),
                    noise: zod_1.z.boolean().optional(),
                })
                    .optional(),
                buttonStyle: zod_1.z
                    .object({
                    type: zod_1.z.string().optional(),
                    className: zod_1.z.string().optional(),
                    backgroundStyle: zod_1.z
                        .object({
                        color: zod_1.z.string().optional(),
                        properties: zod_1.z.record(zod_1.z.any()).optional(),
                    })
                        .optional(),
                    shadowStyle: zod_1.z
                        .object({
                        type: zod_1.z.string().optional(),
                        color: zod_1.z.string().optional(),
                        properties: zod_1.z.record(zod_1.z.any()).optional(),
                    })
                        .optional(),
                    cornerStyle: zod_1.z
                        .object({
                        type: zod_1.z.string().optional(),
                        properties: zod_1.z.record(zod_1.z.any()).optional(),
                    })
                        .optional(),
                    textStyle: zod_1.z
                        .object({
                        color: zod_1.z.string().optional(),
                        properties: zod_1.z.record(zod_1.z.any()).optional(),
                    })
                        .optional(),
                    shapeStyle: zod_1.z
                        .object({
                        properties: zod_1.z.record(zod_1.z.any()).optional(),
                    })
                        .optional(),
                })
                    .optional(),
                typeface: zod_1.z
                    .object({
                    color: zod_1.z.string().optional(),
                    family: zod_1.z.string().optional(),
                })
                    .optional(),
                socialStyle: zod_1.z
                    .object({
                    color: zod_1.z.string().optional(),
                })
                    .optional(),
                heading: zod_1.z
                    .object({
                    type: zod_1.z.string().optional(),
                    logo: zod_1.z.string().nullable().optional(),
                    font: zod_1.z.string().optional(),
                    color: zod_1.z.string().optional(),
                    size: zod_1.z.string().optional(),
                    effect: zod_1.z.string().optional(),
                    logoSize: zod_1.z.string().optional(),
                })
                    .optional(),
                footer: zod_1.z
                    .object({
                    logoUrl: zod_1.z.string().nullable().optional(),
                    url: zod_1.z.string().nullable().optional(),
                    color: zod_1.z.string().nullable().optional(),
                })
                    .optional(),
            }),
        });
        const paramsValidation = paramsSchema.safeParse(request.params);
        const bodyValidation = bodySchema.safeParse(request.body);
        if (!paramsValidation.success) {
            return reply
                .status(400)
                .send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() });
        }
        if (!bodyValidation.success) {
            return reply
                .status(400)
                .send({ message: 'Invalid preset data.', issues: bodyValidation.error.format() });
        }
        const { pageId } = paramsValidation.data;
        const { title, preset } = bodyValidation.data;
        try {
            // Verificar se a página existe e se o usuário é dono
            const page = yield prisma_1.prisma.page.findUnique({
                where: { id: pageId },
                include: { theme: true },
            });
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            // @ts-expect-error - JWT plugin adds user to request
            if (page.ownerId !== request.user.sub) {
                return reply.status(403).send({ message: 'Forbidden: You do not own this page.' });
            }
            // Se já existe um tema, deletar (ou você pode optar por atualizar)
            if (page.theme) {
                // Opcional: deletar background e button antigos se não forem reutilizados
                yield prisma_1.prisma.theme.delete({ where: { id: page.theme.id } });
            }
            // Criar o novo tema a partir do preset
            const theme = yield (0, theme_preset_helpers_1.createThemeFromPreset)(prisma_1.prisma, pageId, preset, title);
            // Converter para o formato do frontend
            const frontendTheme = (0, theme_preset_helpers_1.themeToFrontendFormat)(theme);
            return reply.status(201).send({ theme: frontendTheme });
        }
        catch (error) {
            if (error instanceof resource_not_found_error_1.ResourceNotFoundError) {
                return reply.status(404).send({ message: error.message });
            }
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.applyThemePreset = applyThemePreset;
