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
require("dotenv/config");
const crypto_1 = require("crypto");
const child_process_1 = require("child_process");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function generateDatabaseURL(schema) {
    if (!process.env.DATABASE_URL) {
        throw new Error('Please provide a DATABASE_URL environment variable');
    }
    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schema);
    return url.toString();
}
exports.default = {
    name: 'prisma',
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            const schema = (0, crypto_1.randomUUID)();
            const databaseURL = generateDatabaseURL(schema);
            process.env.DATABASE_URL = databaseURL;
            (0, child_process_1.execSync)('npx prisma migrate deploy');
            return {
                teardown() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield prisma.$executeRawUnsafe(`
          DROP SCHEMA IF EXISTS "${schema}" CASCADE
        `);
                        yield prisma.$disconnect();
                    });
                },
            };
        });
    },
};
