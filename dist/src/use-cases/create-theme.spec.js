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
const vitest_1 = require("vitest");
const create_theme_usecase_1 = require("./create-theme.usecase");
const in_memory_themes_repository_1 = require("../repositories/in-memory/in-memory-themes-repository");
let themeRepository;
let sut;
(0, vitest_1.describe)('Create Gym Use Case', () => {
    (0, vitest_1.beforeEach)(() => {
        themeRepository = new in_memory_themes_repository_1.InMemoryThemesRepository();
        sut = new create_theme_usecase_1.CreateThemeUseCase(themeRepository);
    });
    (0, vitest_1.it)('should be able to create gym', () => __awaiter(void 0, void 0, void 0, function* () {
        const { theme } = yield sut.execute({
            title: 'Tema do Shrek',
            pageId: 'adryeli',
            backgroundId: null,
            buttonId: null,
        });
        (0, vitest_1.expect)(theme.id.toString()).toEqual(vitest_1.expect.any(String));
    }));
});
