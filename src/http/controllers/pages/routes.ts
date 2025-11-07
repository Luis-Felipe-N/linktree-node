import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createPage } from './create-page.controller'
import { getPageDetails } from './get-page-details.controller'
import { getPageBySlug } from './get-page-by-id.controller'
import { getUserPages } from './get-user-pages.controller'
// Importar outros controllers que você criar (updatePage, deletePage, listUserPages, etc.)

export async function pagesRoutes(app: FastifyInstance) {
  /**
   * Públicas
   */
  // GET /pages/{slug} - Busca detalhes públicos da página pelo slug
  app.get('/pages/:slug', getPageDetails)

  /**
   * Autenticadas (requer JWT)
   */
  // GET /me/pages - Lista páginas do usuário logado
  app.get('/me/pages', { onRequest: [verifyJWT] }, getUserPages)

  // POST /pages - Cria uma nova página para o usuário logado
  app.post('/pages', { onRequest: [verifyJWT] }, createPage)

  // POST /pages/{pageId}/links - Adiciona um link à página (requer propriedade)
  // app.post('/pages/:pageId/links', { onRequest: [verifyJWT] }, addLink)

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
}