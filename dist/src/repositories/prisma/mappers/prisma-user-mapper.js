"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserMapper = void 0;
const user_entity_1 = require("../../../domain/enterprise/entities/user.entity");
const unique_entity_id_1 = require("../../../core/entities/unique-entity-id");
class PrismaUserMapper {
    static toDomain(raw) {
        return user_entity_1.User.create({
            username: raw.username,
            email: raw.email,
            password_hash: raw.password_hash,
        }, new unique_entity_id_1.UniqueEntityID(raw.id));
    }
    static toPrisma(user) {
        var _a;
        return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            password_hash: user.password_hash,
            created_at: user.created_at,
            updated_at: (_a = user.updated_at) !== null && _a !== void 0 ? _a : new Date(),
        };
    }
    static toDomainList(raw) {
        return raw.map(r => this.toDomain(r));
    }
}
exports.PrismaUserMapper = PrismaUserMapper;
