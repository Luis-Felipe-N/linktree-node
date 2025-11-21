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
const in_memory_pages_repository_1 = require("@/repositories/in-memory/in-memory-pages-repository");
const in_memory_themes_repository_1 = require("@/repositories/in-memory/in-memory-themes-repository");
const in_memory_background_repository_1 = require("@/repositories/in-memory/in-memory-background-repository");
const in_memory_button_repository_1 = require("@/repositories/in-memory/in-memory-button-repository");
const update_page_theme_usecase_1 = require("./update-page-theme.usecase");
const page_entity_1 = require("@/domain/enterprise/entities/page.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../errors/resource-not-found-error");
let pagesRepository;
let themesRepository;
let backgroundRepository;
let buttonRepository;
let sut;
(0, vitest_1.describe)('UpdatePageThemeUseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        pagesRepository = new in_memory_pages_repository_1.InMemoryPagesRepository();
        themesRepository = new in_memory_themes_repository_1.InMemoryThemesRepository();
        backgroundRepository = new in_memory_background_repository_1.InMemoryBackgroundRepository();
        buttonRepository = new in_memory_button_repository_1.InMemoryButtonRepository();
        sut = new update_page_theme_usecase_1.UpdatePageThemeUseCase(pagesRepository, themesRepository, backgroundRepository, buttonRepository);
    });
    (0, vitest_1.it)('should be able to update page theme with background and button', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
            title: 'Test Page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const themeData = {
            key: 'new-york',
            editable: true,
            luminance: 'DARK',
            background: {
                type: 'gradient',
                gradientStart: '#1a1a1a',
                gradientEnd: '#2d2d2d',
                gradientDirection: 'to bottom',
            },
            button: {
                style: 'filled',
                color: '#ffffff',
                textColor: '#000000',
                fontFamily: 'Inter',
                fontWeight: 'bold',
            },
        };
        const result = yield sut.execute({
            pageId: 'page-123',
            ownerId: userId,
            themeData,
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        (0, vitest_1.expect)(result.theme).toBeTruthy();
        (0, vitest_1.expect)(result.theme.pageId.toString()).toBe('page-123');
        (0, vitest_1.expect)(result.theme.title).toBe('new-york');
        (0, vitest_1.expect)(result.theme.backgroundId).toBeTruthy();
        (0, vitest_1.expect)(result.theme.buttonId).toBeTruthy();
        (0, vitest_1.expect)(themesRepository.items).toHaveLength(1);
        (0, vitest_1.expect)(backgroundRepository.items).toHaveLength(1);
        (0, vitest_1.expect)(buttonRepository.items).toHaveLength(1);
    }));
    (0, vitest_1.it)('should be able to update theme with only background', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const themeData = {
            key: 'minimal',
            background: {
                type: 'color',
                color: '#ffffff',
            },
        };
        yield sut.execute({
            pageId: 'page-123',
            ownerId: userId,
            themeData,
        });
        (0, vitest_1.expect)(backgroundRepository.items).toHaveLength(1);
        (0, vitest_1.expect)(buttonRepository.items).toHaveLength(0);
        const bg = backgroundRepository.items[0];
        (0, vitest_1.expect)(bg.type).toBe('color');
        (0, vitest_1.expect)(bg.color).toBe('#ffffff');
    }));
    (0, vitest_1.it)('should be able to update theme with only button style', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const themeData = {
            key: 'buttons-only',
            button: {
                style: 'outline',
                color: '#000000',
                textColor: '#000000',
            },
        };
        yield sut.execute({
            pageId: 'page-123',
            ownerId: userId,
            themeData,
        });
        (0, vitest_1.expect)(backgroundRepository.items).toHaveLength(0);
        (0, vitest_1.expect)(buttonRepository.items).toHaveLength(1);
        const btn = buttonRepository.items[0];
        (0, vitest_1.expect)(btn.style).toBe('outline');
        (0, vitest_1.expect)(btn.color).toBe('#000000');
    }));
    (0, vitest_1.it)('should not be able to update theme for non-existent page', () => __awaiter(void 0, void 0, void 0, function* () {
        const themeData = {
            key: 'test',
            background: {
                type: 'color',
                color: '#fff',
            },
        };
        yield (0, vitest_1.expect)(() => sut.execute({
            pageId: 'non-existent-page',
            ownerId: 'user-123',
            themeData,
        })).rejects.toBeInstanceOf(resource_not_found_error_1.ResourceNotFoundError);
    }));
    (0, vitest_1.it)('should create theme even without background or button data', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const themeData = {
            key: 'minimal-theme',
        };
        const result = yield sut.execute({
            pageId: 'page-123',
            ownerId: userId,
            themeData,
        });
        (0, vitest_1.expect)(result.success).toBe(true);
        (0, vitest_1.expect)(themesRepository.items).toHaveLength(1);
        (0, vitest_1.expect)(backgroundRepository.items).toHaveLength(0);
        (0, vitest_1.expect)(buttonRepository.items).toHaveLength(0);
        const theme = themesRepository.items[0];
        (0, vitest_1.expect)(theme.backgroundId).toBeNull();
        (0, vitest_1.expect)(theme.buttonId).toBeNull();
    }));
});
