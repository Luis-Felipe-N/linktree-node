"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPresenter = void 0;
class UserPresenter {
    static toHTTP(user) {
        return {
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    static toHTTPList(users) {
        return users.map(u => this.toHTTP(u));
    }
}
exports.UserPresenter = UserPresenter;
