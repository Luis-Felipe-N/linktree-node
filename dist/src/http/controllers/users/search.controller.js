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
exports.search = void 0;
const zod_1 = require("zod");
const make_search_user_use_case_1 = require("@/use-cases/factories/make-search-user-use-case");
function search(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const searchQuerySchema = zod_1.z.object({
            email: zod_1.z.string().email().optional(),
            username: zod_1.z.string().optional(),
        });
        const { email, username } = searchQuerySchema.parse(request.query);
        const searchUserUseCase = (0, make_search_user_use_case_1.makeSearchUserUseCase)();
        const { existing } = yield searchUserUseCase.execute({ email, username });
        return reply.status(200).send({
            existing: existing,
        });
    });
}
exports.search = search;
