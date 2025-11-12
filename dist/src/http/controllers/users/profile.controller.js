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
exports.profile = void 0;
const make_get_user_profile_use_case_1 = require("@/use-cases/factories/make-get-user-profile-use-case");
const zod_1 = require("zod");
function profile(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserProfile = (0, make_get_user_profile_use_case_1.makeGetUserProfileUseCase)();
        const { user } = yield getUserProfile.execute({
            userId: request.user.sub,
        });
        return reply.status(200).send({
            user: Object.assign(Object.assign({}, user), { password_hash: zod_1.undefined }),
        });
    });
}
exports.profile = profile;
