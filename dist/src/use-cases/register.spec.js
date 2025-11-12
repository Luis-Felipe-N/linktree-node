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
const register_usecase_1 = require("./register.usecase");
const in_memory_users_repository_1 = require("../repositories/in-memory/in-memory-users-repository");
const user_already_exists_error_1 = require("./errors/user-already-exists-error");
const bcrypt_1 = require("bcrypt");
let usersRepository;
let sut;
(0, vitest_1.describe)('Register UseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        usersRepository = new in_memory_users_repository_1.InMemoryUsersRepository();
        sut = new register_usecase_1.RegisterUseCase(usersRepository);
    });
    (0, vitest_1.it)('should be to able to register', () => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield sut.execute({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password: '123456',
        });
        (0, vitest_1.expect)(user.username).toEqual(vitest_1.expect.any(String));
    }));
    (0, vitest_1.it)('should be to able to register with encrypted password', () => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield sut.execute({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password: '123456',
        });
        const passwordUserIsHashed = yield (0, bcrypt_1.compare)('123456', user.password_hash);
        console.log(user, passwordUserIsHashed);
        return (0, vitest_1.expect)(passwordUserIsHashed).toBe(true);
    }));
    (0, vitest_1.it)('should not be to able to register with email twice', () => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield sut.execute({
            username: 'testedasilva-01',
            email: 'testedasilva01@gmail.com',
            password: '123456',
        });
        (0, vitest_1.expect)(sut.execute({
            username: 'testedasilva-02',
            email: 'testedasilva01@gmail.com',
            password: '123456',
        })).rejects.toBeInstanceOf(user_already_exists_error_1.UserAlreadyExistsError);
    }));
    (0, vitest_1.it)('should not be to able to register with username twice', () => __awaiter(void 0, void 0, void 0, function* () {
        const { user } = yield sut.execute({
            username: 'testedasilva',
            email: 'testedasilva01@gmail.com',
            password: '123456',
        });
        (0, vitest_1.expect)(sut.execute({
            username: 'testedasilva',
            email: 'testedasilva02@gmail.com',
            password: '123456',
        })).rejects.toBeInstanceOf(user_already_exists_error_1.UserAlreadyExistsError);
    }));
});
