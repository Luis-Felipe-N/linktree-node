"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const fastify_1 = __importDefault(require("fastify"));
const zod_1 = require("zod");
const env_1 = require("./env");
const jwt_1 = __importDefault(require("@fastify/jwt"));
const cors_1 = __importDefault(require("@fastify/cors"));
const routes_1 = require("./http/controllers/users/routes");
const routes_2 = require("./http/controllers/pages/routes");
exports.app = (0, fastify_1.default)();
exports.app.register(cors_1.default, {
// put your options here
});
exports.app.register(jwt_1.default, {
    secret: env_1.env.SECRET_KEY,
});
exports.app.register(routes_1.usersRoutes);
exports.app.register(routes_2.pagesRoutes);
exports.app.setErrorHandler((error, _, reply) => {
    if (error instanceof zod_1.ZodError) {
        return reply
            .status(400)
            .send({ message: 'Validation Error', issues: error.format() });
    }
    if (env_1.env.NODE_ENV !== 'prod') {
        console.error(error);
    }
    else {
        // Mandar o error para algum serviço de tratamento
    }
    return reply.status(500).send({ message: 'Internal server error' });
});
