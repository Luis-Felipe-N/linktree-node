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
const helpers_1 = require("../../../test/helpers");
(0, vitest_1.describe)('Fetch Links by Page (E2E)', () => {
    let app;
    let token;
    let pageId;
    let username;
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        app = yield (0, helpers_1.createTestApp)();
    }));
    (0, vitest_1.beforeEach)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helpers_1.cleanDatabase)();
        username = `testuser${Date.now()}`;
        yield app.inject({
            method: 'POST',
            url: '/users',
            payload: {
                name: 'Test User',
                email: `test${Date.now()}@example.com`,
                username,
                password: '123456',
            },
        });
        token = yield (0, helpers_1.authenticateUser)(app, username, '123456');
        const page = yield (0, helpers_1.createTestPage)(app, token);
        pageId = page.id;
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, helpers_1.cleanDatabase)();
        yield app.close();
    }));
    (0, vitest_1.it)('should be able to fetch links from a page', () => __awaiter(void 0, void 0, void 0, function* () {
        // Add some links first
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub',
            },
        });
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://linkedin.com/test',
                title: 'LinkedIn',
            },
        });
        // Fetch links
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/${pageId}/links`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.links).toHaveLength(2);
        (0, vitest_1.expect)(body.links[0].title).toBe('GitHub');
        (0, vitest_1.expect)(body.links[0].order).toBe(0);
        (0, vitest_1.expect)(body.links[1].title).toBe('LinkedIn');
        (0, vitest_1.expect)(body.links[1].order).toBe(1);
    }));
    (0, vitest_1.it)('should return links in correct order', () => __awaiter(void 0, void 0, void 0, function* () {
        // Add links
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'First Link',
            },
        });
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://linkedin.com/test',
                title: 'Second Link',
            },
        });
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://twitter.com/test',
                title: 'Third Link',
            },
        });
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/${pageId}/links`,
        });
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.links).toHaveLength(3);
        (0, vitest_1.expect)(body.links[0].order).toBe(0);
        (0, vitest_1.expect)(body.links[1].order).toBe(1);
        (0, vitest_1.expect)(body.links[2].order).toBe(2);
        (0, vitest_1.expect)(body.links[0].title).toBe('First Link');
        (0, vitest_1.expect)(body.links[1].title).toBe('Second Link');
        (0, vitest_1.expect)(body.links[2].title).toBe('Third Link');
    }));
    (0, vitest_1.it)('should return empty array if page has no links', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/${pageId}/links`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.links).toHaveLength(0);
    }));
    (0, vitest_1.it)('should return 404 for non-existent page', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/00000000-0000-0000-0000-000000000000/links`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(404);
    }));
    (0, vitest_1.it)('should return 400 for invalid page ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/invalid-uuid/links`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
    }));
    (0, vitest_1.it)('should not require authentication to fetch links', () => __awaiter(void 0, void 0, void 0, function* () {
        // Add a link
        yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub',
            },
        });
        // Fetch without token
        const response = yield app.inject({
            method: 'GET',
            url: `/pages/${pageId}/links`,
        });
        (0, vitest_1.expect)(response.statusCode).toBe(200);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.links).toHaveLength(1);
    }));
});
