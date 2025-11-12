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
exports.pagesRoutes = void 0;
const verify_jwt_1 = require("@/http/middlewares/verify-jwt");
const create_page_controller_1 = require("./create-page.controller");
const get_page_details_controller_1 = require("./get-page-details.controller");
const get_user_pages_controller_1 = require("./get-user-pages.controller");
const add_link_controller_1 = require("../links/add-link.controller");
const fetch_links_by_page_controller_1 = require("../links/fetch-links-by-page.controller");
// Importar outros controllers que você criar (updatePage, deletePage, listUserPages, etc.)
function pagesRoutes(app) {
    return __awaiter(this, void 0, void 0, function* () {
        /**
         * Públicas
         */
        // GET /pages/{slug} - Busca detalhes públicos da página pelo slug
        app.get('/pages/:slug', get_page_details_controller_1.getPageDetails);
        /**
         * Autenticadas (requer JWT)
         */
        // GET /me/pages - Lista páginas do usuário logado
        app.get('/me/pages', { onRequest: [verify_jwt_1.verifyJWT] }, get_user_pages_controller_1.getUserPages);
        // POST /pages - Cria uma nova página para o usuário logado
        app.post('/pages', { onRequest: [verify_jwt_1.verifyJWT] }, create_page_controller_1.createPage);
        // POST /pages/{pageId}/links - Adiciona um link à página (requer propriedade)
        app.post('/pages/:pageId/links', { onRequest: [verify_jwt_1.verifyJWT] }, add_link_controller_1.addLink);
        // GET /pages/{pageId}/links - Lista todos os links de uma página
        app.get('/pages/:pageId/links', fetch_links_by_page_controller_1.fetchLinksByPage);
        // PUT /pages/{pageId}/theme - Atualiza/Cria o tema da página (requer propriedade)
        // app.put('/pages/:pageId/theme', { onRequest: [verifyJWT] }, updateTheme)
        // POST /pages/{pageId}/theme/preset - Aplica um preset completo do frontend
        // app.post('/pages/:pageId/theme/preset', { onRequest: [verifyJWT] }, applyThemePreset)
        /*
         TODO: Adicionar mais rotas autenticadas conforme necessário:
         - GET /me/pages - Listar páginas do usuário logado
         - PUT /pages/{pageId} - Atualizar detalhes da página (título, descrição, etc.)
         - DELETE /pages/{pageId} - Deletar uma página
         - GET /pages/{pageId}/links - Listar links de uma página (para gerenciamento)
         - PUT /links/{linkId} - Atualizar um link
         - DELETE /links/{linkId} - Deletar um link
         - PATCH /pages/{pageId}/links/reorder - Reordenar links
        */
    });
}
exports.pagesRoutes = pagesRoutes;
