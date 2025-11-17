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
(0, vitest_1.describe)('Add Link to Page (E2E)', () => {
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
    (0, vitest_1.it)('should be able to add a link to a page', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub Profile',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.link).toBeTruthy();
        (0, vitest_1.expect)(body.link.url).toBe('https://github.com/test');
        (0, vitest_1.expect)(body.link.title).toBe('GitHub Profile');
        (0, vitest_1.expect)(body.link.order).toBe(0);
        (0, vitest_1.expect)(body.link.pageId).toBe(pageId);
    }));
    (0, vitest_1.it)('should be able to add multiple links with correct order', () => __awaiter(void 0, void 0, void 0, function* () {
        const link1Response = yield app.inject({
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
        const link2Response = yield app.inject({
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
        const link1 = JSON.parse(link1Response.body).link;
        const link2 = JSON.parse(link2Response.body).link;
        (0, vitest_1.expect)(link1.order).toBe(0);
        (0, vitest_1.expect)(link2.order).toBe(1);
    }));
    (0, vitest_1.it)('should not be able to add a link without authentication', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(401);
    }));
    (0, vitest_1.it)('should not be able to add a link to non-existent page', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/00000000-0000-0000-0000-000000000000/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(404);
    }));
    (0, vitest_1.it)('should not be able to add a link to another user page', () => __awaiter(void 0, void 0, void 0, function* () {
        // Create another user
        const anotherUsername = `anotheruser${Date.now()}`;
        yield app.inject({
            method: 'POST',
            url: '/users',
            payload: {
                name: 'Another User',
                email: `another${Date.now()}@example.com`,
                username: anotherUsername,
                password: '123456',
            },
        });
        const anotherToken = yield (0, helpers_1.authenticateUser)(app, anotherUsername, '123456');
        // Try to add link to first user's page
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${anotherToken}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(403);
    }));
    (0, vitest_1.it)('should be able to add a link with optional fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'https://github.com/test',
                title: 'GitHub Profile',
                thumbnailUrl: 'https://example.com/thumb.png',
                highlightEffect: 'pulse',
                type: 'embed',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(201);
        const body = JSON.parse(response.body);
        (0, vitest_1.expect)(body.link.thumbnailUrl).toBe('https://example.com/thumb.png');
        (0, vitest_1.expect)(body.link.highlightEffect).toBe('pulse');
        (0, vitest_1.expect)(body.link.type).toBe('embed');
    }));
    (0, vitest_1.it)('should return 400 for invalid URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: `/pages/${pageId}/links`,
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                url: 'not-a-valid-url',
                title: 'Invalid',
            },
        });
        (0, vitest_1.expect)(response.statusCode).toBe(400);
    }));
});
