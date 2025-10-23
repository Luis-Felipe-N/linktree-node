import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { createPage } from './create-page.controller'
import { getPageDetails } from './get-page-details.controller'
import { updateTheme } from '../themes/update-theme.controller'
import { addLink } from '../links/add-link.controller'
// Importar outros controllers que você criar (updatePage, deletePage, listUserPages, etc.)

export async function pagesRoutes(app: FastifyInstance) {
  /**
   * Públicas
   */
  // GET /p/{slug} - Busca detalhes públicos da página
  app.get('/p/:slug', getPageDetails)

  /**
   * Autenticadas (requer JWT)
   */
  // POST /pages - Cria uma nova página para o usuário logado
  app.post('/pages', { onRequest: [verifyJWT] }, createPage)

  // POST /pages/{pageId}/links - Adiciona um link à página (requer propriedade)
  app.post('/pages/:pageId/links', { onRequest: [verifyJWT] }, addLink)

  // PUT /pages/{pageId}/theme - Atualiza/Cria o tema da página (requer propriedade)
  app.put('/pages/:pageId/theme', { onRequest: [verifyJWT] }, updateTheme)

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