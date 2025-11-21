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
const authenticate_usecase_1 = require("./authenticate.usecase");
const invalid_credentials_error_1 = require("../errors/invalid-credentials-error");
const make_user_1 = require("test/factories/make-user");
let usersRepository;
let sut;
(0, vitest_1.describe)('Authenticate UseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        usersRepository = new in_memory_users_repository_1.InMemoryUsersRepository();
        sut = new authenticate_usecase_1.AuthenticateUseCase(usersRepository);
    });
    (0, vitest_1.it)('should be to able to authenticate with email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        }));
        const { user } = yield sut.execute({
            email: 'testedasilva01@gmail.com',
            password: '123456',
        });
        (0, vitest_1.expect)(user.id.toString()).toEqual(vitest_1.expect.any(String));
    }));
    (0, vitest_1.it)('should be to able to authenticate with username', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        }));
        const { user } = yield sut.execute({
            username: 'testedasilva',
            password: '123456',
        });
        (0, vitest_1.expect)(user.id.toString()).toEqual(vitest_1.expect.any(String));
    }));
    (0, vitest_1.it)('should not be to able to authenticate with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        }));
        (0, vitest_1.expect)(sut.execute({
            email: 'testedasilva02@gmail.com',
            password: '123456',
        })).rejects.toBeInstanceOf(invalid_credentials_error_1.InvalidCredentialsError);
    }));
    (0, vitest_1.it)('should not be to able to authenticate with invalid username', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        }));
        (0, vitest_1.expect)(sut.execute({
            username: 'testedasilva02',
            password: '123456',
        })).rejects.toBeInstanceOf(invalid_credentials_error_1.InvalidCredentialsError);
    }));
    (0, vitest_1.it)('should not be to able to authenticate with invalid password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password_hash: yield (0, bcrypt_1.hash)('123456', 6),
        }));
        (0, vitest_1.expect)(sut.execute({
            username: 'testedasilva',
            password: '1234567',
        })).rejects.toBeInstanceOf(invalid_credentials_error_1.InvalidCredentialsError);
    }));
});
