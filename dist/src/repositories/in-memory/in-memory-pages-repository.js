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
exports.InMemoryPagesRepository = void 0;
class InMemoryPagesRepository {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.push(data);
            return data;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = this.items.find((item) => item.id.toString() === id);
            return page !== null && page !== void 0 ? page : null;
        });
    }
    findBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = this.items.find((item) => item.slug === slug);
            return page !== null && page !== void 0 ? page : null;
        });
    }
    findByOwnerId(ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const pages = this.items
                .filter((item) => item.ownerId.toString() === ownerId)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
            return pages;
        });
    }
    save(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.items.findIndex((item) => item.id.toString() === page.id.toString());
            if (index >= 0) {
                this.items[index] = page;
            }
            return page;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.items.findIndex((item) => item.id.toString() === id);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
        });
    }
}
exports.InMemoryPagesRepository = InMemoryPagesRepository;
