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
exports.InMemoryThemesRepository = void 0;
class InMemoryThemesRepository {
    constructor() {
        this.items = [];
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.items.push(data);
            return data;
        });
    }
    save(theme) {
        return __awaiter(this, void 0, void 0, function* () {
            const themeIndex = this.items.findIndex((item) => item.id === theme.id);
            if (themeIndex >= 0) {
                this.items[themeIndex] = theme;
            }
            return theme;
        });
    }
}
exports.InMemoryThemesRepository = InMemoryThemesRepository;
