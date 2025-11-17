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
exports.create = void 0;
const make_create_theme_use_case_1 = require("../../../use-cases/factories/make-create-theme-use-case");
const zod_1 = require("zod");
function create(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createThemeBodySchema = zod_1.z.object({
            title: zod_1.z.string(),
            backgroundId: zod_1.z.string().nullable(),
            buttonId: zod_1.z.string().nullable(),
        });
        const { backgroundId, buttonId, title } = createThemeBodySchema.parse(request.body);
        const createThemeUseCase = (0, make_create_theme_use_case_1.makeCreateThemeUseCase)();
        yield createThemeUseCase.execute({
            title,
            userId: request.user.sub,
            buttonId,
            backgroundId,
        });
        return reply.status(201).send();
    });
}
exports.create = create;
