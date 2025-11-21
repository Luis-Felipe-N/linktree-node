"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniqueEntityID = void 0;
const crypto_1 = require("crypto");
class UniqueEntityID {
    toString() {
        return this.value;
    }
    constructor(value) {
        this.value = value !== null && value !== void 0 ? value : (0, crypto_1.randomUUID)();
    }
}
exports.UniqueEntityID = UniqueEntityID;
