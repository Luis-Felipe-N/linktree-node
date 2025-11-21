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
exports.PrismaButtonRepository = void 0;
const prisma_1 = require("../../lib/prisma");
const prisma_button_mapper_1 = require("./mappers/prisma-button-mapper");
class PrismaButtonRepository {
    create(button) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = prisma_button_mapper_1.PrismaButtonMapper.toPrisma(button);
            const createdButton = yield prisma_1.prisma.button.create({
                data
            });
            return prisma_button_mapper_1.PrismaButtonMapper.toDomain(createdButton);
        });
    }
    save(button) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = prisma_button_mapper_1.PrismaButtonMapper.toPrisma(button);
            const updatedButton = yield prisma_1.prisma.button.update({
                where: { id: button.id.toString() },
                data
            });
            return prisma_button_mapper_1.PrismaButtonMapper.toDomain(updatedButton);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const button = yield prisma_1.prisma.button.findUnique({
                where: { id }
            });
            if (!button) {
                return null;
            }
            return prisma_button_mapper_1.PrismaButtonMapper.toDomain(button);
        });
    }
}
exports.PrismaButtonRepository = PrismaButtonRepository;
