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
const fetch_links_by_page_usecase_1 = require("./fetch-links-by-page.usecase");
const link_entity_1 = require("@/domain/enterprise/entities/link.entity");
const unique_entity_id_1 = require("@/core/entities/unique-entity-id");
let linksRepository;
let sut;
(0, vitest_1.describe)('FetchLinksByPageUseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        linksRepository = new in_memory_links_repository_1.InMemoryLinksRepository();
        sut = new fetch_links_by_page_usecase_1.FetchLinksByPageUseCase(linksRepository);
    });
    (0, vitest_1.it)('should be able to fetch links from a page', () => __awaiter(void 0, void 0, void 0, function* () {
        const link1 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-123'),
            url: 'https://github.com/test',
            title: 'GitHub',
            order: 0,
        });
        const link2 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-123'),
            url: 'https://linkedin.com/test',
            title: 'LinkedIn',
            order: 1,
        });
        yield linksRepository.create(link1);
        yield linksRepository.create(link2);
        const result = yield sut.execute({ pageId: 'page-123' });
        (0, vitest_1.expect)(result.links).toHaveLength(2);
        (0, vitest_1.expect)(result.links[0].title).toBe('GitHub');
        (0, vitest_1.expect)(result.links[1].title).toBe('LinkedIn');
    }));
    (0, vitest_1.it)('should return links in correct order', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create links in reverse order
        const link3 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-123'),
            url: 'https://twitter.com/test',
            title: 'Twitter',
            order: 2,
        });
        const link1 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-123'),
            url: 'https://github.com/test',
            title: 'GitHub',
            order: 0,
        });
        const link2 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-123'),
            url: 'https://linkedin.com/test',
            title: 'LinkedIn',
            order: 1,
        });
        yield linksRepository.create(link3);
        yield linksRepository.create(link1);
        yield linksRepository.create(link2);
        const result = yield sut.execute({ pageId: 'page-123' });
        (0, vitest_1.expect)(result.links).toHaveLength(3);
        (0, vitest_1.expect)(result.links[0].order).toBe(0);
        (0, vitest_1.expect)(result.links[1].order).toBe(1);
        (0, vitest_1.expect)(result.links[2].order).toBe(2);
        (0, vitest_1.expect)(result.links[0].title).toBe('GitHub');
        (0, vitest_1.expect)(result.links[1].title).toBe('LinkedIn');
        (0, vitest_1.expect)(result.links[2].title).toBe('Twitter');
    }));
    (0, vitest_1.it)('should return empty array if page has no links', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield sut.execute({ pageId: 'page-123' });
        (0, vitest_1.expect)(result.links).toHaveLength(0);
    }));
    (0, vitest_1.it)('should not return links from other pages', () => __awaiter(void 0, void 0, void 0, function* () {
        const link1 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-1'),
            url: 'https://github.com/test1',
            order: 0,
        });
        const link2 = link_entity_1.Link.create({
            pageId: new unique_entity_id_1.UniqueEntityID('page-2'),
            url: 'https://github.com/test2',
            order: 0,
        });
        yield linksRepository.create(link1);
        yield linksRepository.create(link2);
        const result = yield sut.execute({ pageId: 'page-1' });
        (0, vitest_1.expect)(result.links).toHaveLength(1);
        (0, vitest_1.expect)(result.links[0].url).toBe('https://github.com/test1');
    }));
});
