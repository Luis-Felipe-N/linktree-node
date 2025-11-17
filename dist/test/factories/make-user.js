"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUser = void 0;
const user_entity_1 = require("../../src/domain/enterprise/entities/user.entity");
const faker_1 = require("@faker-js/faker");
function makeUser(override = {}, id) {
    const user = user_entity_1.User.create(Object.assign({ username: faker_1.faker.internet.username(), email: faker_1.faker.internet.email(), password_hash: faker_1.faker.internet.password() }, override), id);
    return user;
}
exports.makeUser = makeUser;
