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
exports.InMemoryButtonRepository = void 0;
class InMemoryButtonRepository {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.push(data);
            return data;
        });
    }
    save(button) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.items.findIndex((item) => item.id.toString() === button.id.toString());
            if (index >= 0) {
                this.items[index] = button;
            }
            else {
                this.items.push(button);
            }
            return button;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const button = this.items.find((item) => item.id.toString() === id);
            return button !== null && button !== void 0 ? button : null;
        });
    }
}
exports.InMemoryButtonRepository = InMemoryButtonRepository;
