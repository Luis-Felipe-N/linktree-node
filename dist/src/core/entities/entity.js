"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const unique_entity_id_1 = require("./unique-entity-id");
class Entity {
    get id() {
        return this._id;
    }
    constructor(props, id) {
        this._id = id !== null && id !== void 0 ? id : new unique_entity_id_1.UniqueEntityID(id);
        this.props = props;
    }
}
exports.Entity = Entity;
