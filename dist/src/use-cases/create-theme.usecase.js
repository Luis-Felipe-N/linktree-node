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
exports.CreateThemeUseCase = void 0;
const theme_entity_1 = require("../domain/enterprise/entities/theme.entity");
const unique_entity_id_1 = require("../core/entities/unique-entity-id");
class CreateThemeUseCase {
    constructor(themeRepository) {
        this.themeRepository = themeRepository;
    }
    execute({ title, pageId, backgroundId, buttonId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const theme = theme_entity_1.Theme.create({
                title,
                backgroundId: backgroundId ? new unique_entity_id_1.UniqueEntityID(backgroundId) : null,
                buttonId: buttonId ? new unique_entity_id_1.UniqueEntityID(buttonId) : null,
                pageId: new unique_entity_id_1.UniqueEntityID(pageId),
            });
            yield this.themeRepository.create(theme);
            return {
                theme,
            };
        });
    }
}
exports.CreateThemeUseCase = CreateThemeUseCase;
