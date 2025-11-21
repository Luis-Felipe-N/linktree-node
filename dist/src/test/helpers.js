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
exports.createTestPage = exports.authenticateUser = exports.createTestUser = exports.cleanDatabase = exports.createTestApp = void 0;
const app_1 = require("@/app");
const prisma_1 = require("@/lib/prisma");
function createTestApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield app_1.app.ready();
        return app_1.app;
    });
}
exports.createTestApp = createTestApp;
function cleanDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma_1.prisma.link.deleteMany();
        yield prisma_1.prisma.theme.deleteMany();
        yield prisma_1.prisma.background.deleteMany();
        yield prisma_1.prisma.button.deleteMany();
        yield prisma_1.prisma.page.deleteMany();
        yield prisma_1.prisma.user.deleteMany();
    });
}
exports.cleanDatabase = cleanDatabase;
function createTestUser(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: '/users',
            payload: {
                name: 'Test User',
                email: `test-${Date.now()}@example.com`,
                username: `testuser${Date.now()}`,
                password: '123456',
            },
        });
        return JSON.parse(response.body);
    });
}
exports.createTestUser = createTestUser;
function authenticateUser(app, username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: '/sessions',
            payload: {
                username,
                password,
            },
        });
        const body = JSON.parse(response.body);
        return body.token;
    });
}
exports.authenticateUser = authenticateUser;
function createTestPage(app, token, slug) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield app.inject({
            method: 'POST',
            url: '/pages',
            headers: {
                authorization: `Bearer ${token}`,
            },
            payload: {
                slug: slug || `test-page-${Date.now()}`,
                title: 'Test Page',
                description: 'Test Description',
            },
        });
        const body = JSON.parse(response.body);
        return body.page;
    });
}
exports.createTestPage = createTestPage;
