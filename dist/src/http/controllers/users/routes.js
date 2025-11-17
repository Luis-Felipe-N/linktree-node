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
exports.usersRoutes = void 0;
const register_controller_1 = require("./register.controller");
const search_controller_1 = require("./search.controller");
const authenticate_controller_1 = require("./authenticate.controller");
const profile_controller_1 = require("./profile.controller");
const verify_jwt_1 = require("../../middlewares/verify-jwt");
function usersRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        app.post('/users', register_controller_1.register);
        app.get('/users/search', search_controller_1.search);
        app.post('/sessions', authenticate_controller_1.authenticate);
        app.get('/me', { onRequest: [verify_jwt_1.verifyJWT] }, profile_controller_1.profile);
    });
}
exports.usersRoutes = usersRoutes;
