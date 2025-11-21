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
exports.PrismaUsersRepository = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_user_mapper_1 = require("./mappers/prisma-user-mapper");
class PrismaUsersRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield prisma_1.prisma.user.findUnique({
                where: { id },
            });
            if (!user)
                return null;
            return prisma_user_mapper_1.PrismaUserMapper.toDomain(user);
        });
    }
    findByEmailOrUsername({ email, username, }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (email) {
                const userWithEmail = yield prisma_1.prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (userWithEmail) {
                    return prisma_user_mapper_1.PrismaUserMapper.toDomain(userWithEmail);
                }
            }
            if (username) {
                const userWithUsername = yield prisma_1.prisma.user.findUnique({
                    where: {
                        username,
                    },
                });
                if (userWithUsername) {
                    return prisma_user_mapper_1.PrismaUserMapper.toDomain(userWithUsername);
                }
            }
            return null;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaData = prisma_user_mapper_1.PrismaUserMapper.toPrisma(data);
            const created = yield prisma_1.prisma.user.create({ data: prismaData });
            return prisma_user_mapper_1.PrismaUserMapper.toDomain(created);
        });
    }
}
exports.PrismaUsersRepository = PrismaUsersRepository;
