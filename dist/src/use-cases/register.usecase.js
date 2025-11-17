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
exports.RegisterUseCase = void 0;
const bcrypt_1 = require("bcrypt");
const user_already_exists_error_1 = require("./errors/user-already-exists-error");
const user_entity_1 = require("../domain/enterprise/entities/user.entity");
class RegisterUseCase {
    constructor(UsersRepository) {
        this.UsersRepository = UsersRepository;
    }
    execute({ username, email, password, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const password_hashed = yield (0, bcrypt_1.hash)(password, 6);
            const userAlreadyExists = yield this.UsersRepository.findByEmailOrUsername({
                email,
                username,
            });
            if (userAlreadyExists) {
                throw new user_already_exists_error_1.UserAlreadyExistsError();
            }
            const user = user_entity_1.User.create({
                email,
                username,
                password_hash: password_hashed,
            });
            const userCreated = yield this.UsersRepository.create(user);
            return { user: userCreated };
        });
    }
}
exports.RegisterUseCase = RegisterUseCase;
