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
exports.UpdatePageThemeUseCase = void 0;
const resource_not_found_error_1 = require("../errors/resource-not-found-error");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const make_theme_1 = require("../makers/make-theme");
const make_background_1 = require("../makers/make-background");
const make_button_1 = require("../makers/make-button");
class UpdatePageThemeUseCase {
    constructor(pagesRepository, themesRepository, backgroundRepository, buttonRepository) {
        this.pagesRepository = pagesRepository;
        this.themesRepository = themesRepository;
        this.backgroundRepository = backgroundRepository;
        this.buttonRepository = buttonRepository;
    }
    execute({ pageId, ownerId, themeData, }) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const page = yield this.pagesRepository.findById(pageId);
            console.log("Found page:", themeData);
            if (!page || page.ownerId.toString() !== ownerId) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            const currentTheme = yield this.themesRepository.findByPageId(pageId);
            const background = yield this.upsertBackground(themeData.background, (_a = currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.background) !== null && _a !== void 0 ? _a : null);
            const button = yield this.upsertButton(themeData.button, (_b = currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.button) !== null && _b !== void 0 ? _b : null);
            const theme = (0, make_theme_1.maketheme)({
                pageId: new unique_entity_id_1.UniqueEntityID(pageId),
                background,
                button,
                active: (_d = (_c = themeData.active) !== null && _c !== void 0 ? _c : currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.active) !== null && _d !== void 0 ? _d : true,
                created_at: currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.created_at,
            }, currentTheme === null || currentTheme === void 0 ? void 0 : currentTheme.id);
            const persistedTheme = currentTheme
                ? yield this.themesRepository.save(theme)
                : yield this.themesRepository.create(theme);
            return {
                theme: persistedTheme,
                success: true,
            };
        });
    }
    upsertBackground(backgroundData, currentBackground) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        return __awaiter(this, void 0, void 0, function* () {
            if (backgroundData === null) {
                return null;
            }
            if (backgroundData === undefined) {
                return currentBackground;
            }
            const snapshot = currentBackground
                ? {
                    type: currentBackground.type,
                    color: (_a = currentBackground.color) !== null && _a !== void 0 ? _a : undefined,
                    gradientStart: (_b = currentBackground.gradientStart) !== null && _b !== void 0 ? _b : undefined,
                    gradientEnd: (_c = currentBackground.gradientEnd) !== null && _c !== void 0 ? _c : undefined,
                    gradientDirection: (_d = currentBackground.gradientDirection) !== null && _d !== void 0 ? _d : undefined,
                    imageUrl: (_e = currentBackground.imageUrl) !== null && _e !== void 0 ? _e : undefined,
                    videoUrl: (_f = currentBackground.videoUrl) !== null && _f !== void 0 ? _f : undefined,
                    style: (_g = currentBackground.style) !== null && _g !== void 0 ? _g : undefined,
                    properties: (_h = currentBackground.properties) !== null && _h !== void 0 ? _h : undefined,
                    active: currentBackground.active,
                    created_at: currentBackground.created_at,
                }
                : {};
            const payload = Object.assign(Object.assign(Object.assign({}, snapshot), backgroundData), { type: (_k = (_j = backgroundData === null || backgroundData === void 0 ? void 0 : backgroundData.type) !== null && _j !== void 0 ? _j : snapshot.type) !== null && _k !== void 0 ? _k : 'color', active: (_m = (_l = backgroundData === null || backgroundData === void 0 ? void 0 : backgroundData.active) !== null && _l !== void 0 ? _l : snapshot.active) !== null && _m !== void 0 ? _m : true, created_at: snapshot.created_at });
            const background = (0, make_background_1.makeBackground)(payload, currentBackground === null || currentBackground === void 0 ? void 0 : currentBackground.id);
            if (currentBackground) {
                return yield this.backgroundRepository.save(background);
            }
            return yield this.backgroundRepository.create(background);
        });
    }
    upsertButton(buttonData, currentButton) {
        var _a, _b, _c, _d, _e, _f, _g;
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Upserting button with data:", buttonData, "and current button:", currentButton);
            if (buttonData === null) {
                return null;
            }
            if (buttonData === undefined) {
                return currentButton;
            }
            const snapshot = currentButton
                ? {
                    style: currentButton.style,
                    properties: (_a = currentButton.properties) !== null && _a !== void 0 ? _a : undefined,
                    active: currentButton.active,
                    created_at: currentButton.created_at,
                }
                : {};
            const payload = Object.assign(Object.assign({}, snapshot), { style: (_c = (_b = buttonData === null || buttonData === void 0 ? void 0 : buttonData.style) !== null && _b !== void 0 ? _b : snapshot.style) !== null && _c !== void 0 ? _c : 'filled', properties: (_e = (_d = buttonData === null || buttonData === void 0 ? void 0 : buttonData.properties) !== null && _d !== void 0 ? _d : snapshot.properties) !== null && _e !== void 0 ? _e : null, active: (_g = (_f = buttonData === null || buttonData === void 0 ? void 0 : buttonData.active) !== null && _f !== void 0 ? _f : snapshot.active) !== null && _g !== void 0 ? _g : true, created_at: snapshot.created_at });
            const button = (0, make_button_1.makeButton)(payload, currentButton === null || currentButton === void 0 ? void 0 : currentButton.id);
            if (currentButton) {
                return yield this.buttonRepository.save(button);
            }
            return yield this.buttonRepository.create(button);
        });
    }
}
exports.UpdatePageThemeUseCase = UpdatePageThemeUseCase;
