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
const in_memory_users_repository_1 = require("../../repositories/in-memory/in-memory-users-repository");
const bcrypt_1 = require("bcrypt");
const search_user_usecase_1 = require("./search-user.usecase");
const make_user_1 = require("test/factories/make-user");
let usersRepository;
let sut;
(0, vitest_1.describe)('Search User UseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        usersRepository = new in_memory_users_repository_1.InMemoryUsersRepository();
        sut = new search_user_usecase_1.SearchUserUseCase(usersRepository);
    });
    (0, vitest_1.it)('should be to able search user by username', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMaked = (0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        });
        yield usersRepository.create(userMaked);
        const { existing } = yield sut.execute({
            username: 'testedasilva',
        });
        (0, vitest_1.expect)(existing).toBe(true);
    }));
    (0, vitest_1.it)('should be to able search user by email', () => __awaiter(void 0, void 0, void 0, function* () {
        const userMaked = (0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        });
        const userCreated = yield usersRepository.create(userMaked);
        const { existing } = yield sut.execute({
            email: 'testedasilva01@gmail.com',
        });
        (0, vitest_1.expect)(existing).toBe(true);
    }));
    (0, vitest_1.it)('should not be to able get profile with wrong username', () => __awaiter(void 0, void 0, void 0, function* () {
        const { existing } = yield sut.execute({
            username: 'non-exists-username',
        });
        (0, vitest_1.expect)(existing).toBe(false);
    }));
    (0, vitest_1.it)('should not be to able get profile with wrong email', () => __awaiter(void 0, void 0, void 0, function* () {
        const { existing } = yield sut.execute({
            email: 'non-exists-email',
        });
        (0, vitest_1.expect)(existing).toBe(false);
    }));
});
