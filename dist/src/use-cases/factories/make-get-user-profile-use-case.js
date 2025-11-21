"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserProfileUseCase = void 0;
const prisma_user_repository_1 = require("../../repositories/prisma/prisma-user-repository");
const get_profile_usecase_1 = require("../users/get-profile.usecase");
function makeGetUserProfileUseCase() {
    const usersRepository = new prisma_user_repository_1.PrismaUsersRepository();
    const useCase = new get_profile_usecase_1.ProfileUseCase(usersRepository);
    return useCase;
}
exports.makeGetUserProfileUseCase = makeGetUserProfileUseCase;
