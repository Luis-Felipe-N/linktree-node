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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("@/app");
const supertest_1 = __importDefault(require("supertest"));
const vitest_1 = require("vitest");
(0, vitest_1.describe)('Register (e2e)', () => {
    (0, vitest_1.beforeAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app_1.app.ready();
    }));
    (0, vitest_1.afterAll)(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app_1.app.close();
    }));
    (0, vitest_1.it)('should be to able register', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app.server).post('/users').send({
            email: 'luiss@gmail.com',
            username: 'Luis Felipe',
            password: '123456',
        });
        (0, vitest_1.expect)(response.statusCode).toEqual(201);
    }));
});
