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
exports.getUserPages = void 0;
const make_get_user_pages_use_case_1 = require("@/use-cases/factories/make-get-user-pages-use-case");
const page_presenter_1 = require("@/http/presenters/page-presenter");
function getUserPages(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!request.user || !request.user.sub) {
            return reply.status(401).send({ message: 'Unauthorized.' });
        }
        try {
            const getUserPagesUseCase = (0, make_get_user_pages_use_case_1.makeGetUserPagesUseCase)();
            const userId = request.user.sub;
            const { pages } = yield getUserPagesUseCase.execute({ userId });
            return reply.status(200).send({ pages: pages.map(page_presenter_1.PagePresenter.toHTTP) });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
    });
}
exports.getUserPages = getUserPages;
