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
const in_memory_users_repository_1 = require("../repositories/in-memory/in-memory-users-repository");
const get_profile_usecase_1 = require("./get-profile.usecase");
const resource_not_found_error_1 = require("./errors/resource-not-found-error");
const make_user_1 = require("test/factories/make-user");
let usersRepository;
let sut;
(0, vitest_1.describe)('Profile UseCase', () => {
    (0, vitest_1.beforeEach)(() => {
        usersRepository = new in_memory_users_repository_1.InMemoryUsersRepository();
        sut = new get_profile_usecase_1.ProfileUseCase(usersRepository);
    });
    (0, vitest_1.it)('should be to able get user by username', () => __awaiter(void 0, void 0, void 0, function* () {
        const userCreated = yield usersRepository.create((0, make_user_1.makeUser)({
            username: 'testedasilva',
        }));
        const { user } = yield sut.execute({
            userId: userCreated.id.toString(),
        });
        (0, vitest_1.expect)(user.username).toBe('testedasilva');
    }));
    (0, vitest_1.it)('should not be to able get profile with wrong id', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, vitest_1.expect)(sut.execute({
            userId: 'non-exists-id',
        })).rejects.toBeInstanceOf(resource_not_found_error_1.ResourceNotFoundError);
    }));
});
