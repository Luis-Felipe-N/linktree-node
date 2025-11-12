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
exports.GetPageDetailsUseCase = void 0;
const resource_not_found_error_1 = require("./errors/resource-not-found-error");
/**
 * Caso de uso: Buscar detalhes de uma página pelo slug ou ID
 * - Usado para visualização pública de páginas
 * - Requer slug OU id
 */
class GetPageDetailsUseCase {
    constructor(pagesRepository) {
        this.pagesRepository = pagesRepository;
    }
    execute({ slug, id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            // Valida que pelo menos um parâmetro foi fornecido
            if (!slug && !id) {
                throw new Error('Either slug or id must be provided');
            }
            let page = null;
            // Busca por slug se fornecido
            if (slug) {
                page = yield this.pagesRepository.findBySlug(slug);
            }
            // Se não encontrou por slug ou slug não foi fornecido, busca por ID
            else if (id) {
                page = yield this.pagesRepository.findById(id);
            }
            if (!page) {
                throw new resource_not_found_error_1.ResourceNotFoundError();
            }
            return {
                page,
            };
        });
    }
}
exports.GetPageDetailsUseCase = GetPageDetailsUseCase;
