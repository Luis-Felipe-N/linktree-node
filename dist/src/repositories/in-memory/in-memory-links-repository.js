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
exports.InMemoryLinksRepository = void 0;
class InMemoryLinksRepository {
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
            const link = this.items.find((item) => item.id.toString() === id);
            return link !== null && link !== void 0 ? link : null;
        });
    }
    findByPageId(pageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const links = this.items
                .filter((item) => item.pageId.toString() === pageId)
                .sort((a, b) => a.order - b.order);
            return links;
        });
    }
    update(link) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.items.findIndex((item) => item.id.toString() === link.id.toString());
            if (index >= 0) {
                this.items[index] = link;
            }
            return link;
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
    reorderLinks(pageId, linkIds) {
        return __awaiter(this, void 0, void 0, function* () {
            linkIds.forEach((linkId, index) => {
                const link = this.items.find((item) => item.id.toString() === linkId && item.pageId.toString() === pageId);
                if (link) {
                    link.order = index;
                }
            });
        });
    }
}
exports.InMemoryLinksRepository = InMemoryLinksRepository;
