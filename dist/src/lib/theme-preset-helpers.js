"use strict";
/**
 * Helpers para converter entre os presets do frontend (AppearanceTheme)
 * e os modelos do Prisma (Theme, Background, Button).
 *
 * Use estes helpers nos controllers para facilitar a criação de temas
 * a partir dos presets enviados pelo frontend.
 */
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
exports.themeToFrontendFormat = exports.createThemeFromPreset = exports.createButtonFromPreset = exports.createBackgroundFromPreset = void 0;
/**
 * Cria um Background no banco a partir do objeto background do preset.
 */
function createBackgroundFromPreset(prisma, background) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!background)
            return null;
        return yield prisma.background.create({
            data: {
                type: background.type || 'COLOR',
                gradientStart: background.gradientStart || null,
                gradientEnd: background.gradientEnd || null,
                gradientDirection: background.gradientDirection || null,
                imageUrl: background.imageUrl || null,
                videoUrl: background.videoUrl || null,
                style: background.style || null,
                properties: background.properties || null,
                noise: (_a = background.noise) !== null && _a !== void 0 ? _a : false,
                active: true,
            },
        });
    });
}
exports.createBackgroundFromPreset = createBackgroundFromPreset;
/**
 * Cria um Button no banco a partir do objeto buttonStyle do preset.
 */
function createButtonFromPreset(prisma, buttonStyle) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!buttonStyle)
            return null;
        // Monta o objeto properties que armazenará todos os sub-estilos
        const properties = {};
        if (buttonStyle.backgroundStyle) {
            properties.backgroundStyle = buttonStyle.backgroundStyle;
        }
        if (buttonStyle.shadowStyle) {
            properties.shadowStyle = buttonStyle.shadowStyle;
        }
        if (buttonStyle.cornerStyle) {
            properties.cornerStyle = buttonStyle.cornerStyle;
        }
        if (buttonStyle.textStyle) {
            properties.textStyle = buttonStyle.textStyle;
        }
        if (buttonStyle.shapeStyle) {
            properties.shapeStyle = buttonStyle.shapeStyle;
        }
        return yield prisma.button.create({
            data: {
                style: buttonStyle.type || 'FILL',
                className: buttonStyle.className || null,
                properties: Object.keys(properties).length > 0 ? properties : null,
                active: true,
            },
        });
    });
}
exports.createButtonFromPreset = createButtonFromPreset;
/**
 * Cria um Theme completo no banco a partir de um preset do frontend.
 *
 * @param prisma - Cliente Prisma
 * @param pageId - ID da página à qual o tema será vinculado
 * @param preset - Objeto do preset (AppearanceTheme do frontend)
 * @param title - Título do tema (ex: "New York", "Kyoto")
 * @returns Theme criado
 */
function createThemeFromPreset(prisma, pageId, preset, title) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Criar Background se houver
        const background = yield createBackgroundFromPreset(prisma, preset.background);
        // 2. Criar Button se houver
        const button = yield createButtonFromPreset(prisma, preset.buttonStyle);
        // 3. Criar Theme vinculando tudo
        return yield prisma.theme.create({
            data: {
                title,
                key: preset.key || null,
                editable: (_a = preset.editable) !== null && _a !== void 0 ? _a : true,
                luminance: preset.luminance || null,
                pageId,
                backgroundId: (background === null || background === void 0 ? void 0 : background.id) || null,
                buttonId: (button === null || button === void 0 ? void 0 : button.id) || null,
                typeface: preset.typeface || null,
                socialStyle: preset.socialStyle || null,
                heading: preset.heading || null,
                footer: preset.footer || null,
                active: true,
            },
            include: {
                background: true,
                button: true,
            },
        });
    });
}
exports.createThemeFromPreset = createThemeFromPreset;
/**
 * Converte um Theme do Prisma para o formato esperado pelo frontend (AppearanceTheme).
 * Útil para retornar na API.
 */
function themeToFrontendFormat(theme) {
    var _a, _b;
    const result = {
        key: theme.key || undefined,
        editable: (_a = theme.editable) !== null && _a !== void 0 ? _a : true,
        luminance: theme.luminance || undefined,
    };
    // Background
    if (theme.background) {
        result.background = {
            type: theme.background.type,
            style: theme.background.style || undefined,
            gradientStart: theme.background.gradientStart || undefined,
            gradientEnd: theme.background.gradientEnd || undefined,
            gradientDirection: theme.background.gradientDirection || undefined,
            imageUrl: theme.background.imageUrl || undefined,
            videoUrl: theme.background.videoUrl || undefined,
            className: theme.background.className || undefined,
            properties: theme.background.properties || undefined,
            noise: (_b = theme.background.noise) !== null && _b !== void 0 ? _b : false,
        };
    }
    // Button
    if (theme.button && theme.button.properties) {
        result.buttonStyle = Object.assign({ type: theme.button.style, className: theme.button.className || undefined }, theme.button.properties);
    }
    // Outros campos JSON
    if (theme.typeface)
        result.typeface = theme.typeface;
    if (theme.socialStyle)
        result.socialStyle = theme.socialStyle;
    if (theme.heading)
        result.heading = theme.heading;
    if (theme.footer)
        result.footer = theme.footer;
    return result;
}
exports.themeToFrontendFormat = themeToFrontendFormat;
