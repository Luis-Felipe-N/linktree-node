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
const in_memory_links_repository_1 = require("@/repositories/in-memory/in-memory-links-repository");
const in_memory_pages_repository_1 = require("@/repositories/in-memory/in-memory-pages-repository");
const add_link_to_page_usecase_1 = require("./add-link-to-page.usecase");
const page_entity_1 = require("@/domain/enterprise/entities/page.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
const resource_not_found_error_1 = require("../errors/resource-not-found-error");
const unauthorized_error_1 = require("../errors/unauthorized-error");
let linksRepository;
let pagesRepository;
let sut;
(0, vitest_1.describe)('AddLinkToPageUseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        linksRepository = new in_memory_links_repository_1.InMemoryLinksRepository();
        pagesRepository = new in_memory_pages_repository_1.InMemoryPagesRepository();
        sut = new add_link_to_page_usecase_1.AddLinkToPageUseCase(linksRepository, pagesRepository);
    });
    (0, vitest_1.it)('should be able to add a link to a page', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
            title: 'Test Page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const result = yield sut.execute({
            userId,
            pageId: 'page-123',
            url: 'https://github.com/test',
            title: 'GitHub Profile',
        });
        (0, vitest_1.expect)(result.link).toBeTruthy();
        (0, vitest_1.expect)(result.link.url).toBe('https://github.com/test');
        (0, vitest_1.expect)(result.link.title).toBe('GitHub Profile');
        (0, vitest_1.expect)(result.link.order).toBe(0);
        (0, vitest_1.expect)(result.link.pageId.toString()).toBe('page-123');
    }));
    (0, vitest_1.it)('should assign correct order when adding multiple links', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const link1 = yield sut.execute({
            userId,
            pageId: 'page-123',
            url: 'https://github.com/test',
            title: 'GitHub',
        });
        const link2 = yield sut.execute({
            userId,
            pageId: 'page-123',
            url: 'https://linkedin.com/test',
            title: 'LinkedIn',
        });
        const link3 = yield sut.execute({
            userId,
            pageId: 'page-123',
            url: 'https://twitter.com/test',
            title: 'Twitter',
        });
        (0, vitest_1.expect)(link1.link.order).toBe(0);
        (0, vitest_1.expect)(link2.link.order).toBe(1);
        (0, vitest_1.expect)(link3.link.order).toBe(2);
    }));
    (0, vitest_1.it)('should not be able to add a link to a non-existent page', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, vitest_1.expect)(() => sut.execute({
            userId: 'user-123',
            pageId: 'non-existent-page',
            url: 'https://github.com/test',
        })).rejects.toBeInstanceOf(resource_not_found_error_1.ResourceNotFoundError);
    }));
    (0, vitest_1.it)('should not be able to add a link if user is not the page owner', () => __awaiter(void 0, void 0, void 0, function* () {
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID('owner-123'),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        yield (0, vitest_1.expect)(() => sut.execute({
            userId: 'different-user-123',
            pageId: 'page-123',
            url: 'https://github.com/test',
        })).rejects.toBeInstanceOf(unauthorized_error_1.UnauthorizedError);
    }));
    (0, vitest_1.it)('should be able to add a link with optional fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const userId = 'user-123';
        const page = page_entity_1.Page.create({
            ownerId: new unique_entity_id_1.UniqueEntityID(userId),
            slug: 'test-page',
        }, new unique_entity_id_1.UniqueEntityID('page-123'));
        yield pagesRepository.create(page);
        const scheduledStart = new Date('2025-12-01');
        const scheduledEnd = new Date('2025-12-31');
        const result = yield sut.execute({
            userId,
            pageId: 'page-123',
            url: 'https://github.com/test',
            title: 'GitHub Profile',
            thumbnailUrl: 'https://example.com/thumb.png',
            highlightEffect: 'pulse',
            scheduledStart,
            scheduledEnd,
            type: 'embed',
        });
        (0, vitest_1.expect)(result.link.thumbnailUrl).toBe('https://example.com/thumb.png');
        (0, vitest_1.expect)(result.link.highlightEffect).toBe('pulse');
        (0, vitest_1.expect)(result.link.scheduledStart).toEqual(scheduledStart);
        (0, vitest_1.expect)(result.link.scheduledEnd).toEqual(scheduledEnd);
        (0, vitest_1.expect)(result.link.type).toBe('embed');
    }));
});
