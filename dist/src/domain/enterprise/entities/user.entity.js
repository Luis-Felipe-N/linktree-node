"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const entity_1 = require("@/core/entities/entity");
class User extends entity_1.Entity {
    get username() { return this.props.username; }
    get email() { return this.props.email; }
    get password_hash() { return this.props.password_hash; } // Cuidado ao expor
    get created_at() { return this.props.created_at; }
    get updated_at() { return this.props.updated_at; }
    set username(username) {
        this.props.username = username;
        this.touch();
    }
    touch() {
        this.props.updated_at = new Date();
    }
    static create(props, id) {
        const user = new User(Object.assign(Object.assign({}, props), { created_at: new Date(), updated_at: null }), id);
        return user;
    }
}
exports.User = User;
