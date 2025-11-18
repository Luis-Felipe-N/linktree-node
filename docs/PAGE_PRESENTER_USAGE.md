# Page Presenter - Uso com PageDetails

## Como usar o PagePresenter com retornos do PrismaPageMapper

### Exemplo 1: Buscar página com detalhes completos

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { PrismaPageMapper } from '@/repositories/prisma/mappers/prisma-page-mapper'
import { PagePresenter } from '@/http/presenters/page-presenter'

export async function getPageWithDetails(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { slug } = z.object({ slug: z.string() }).parse(request.params)

  // 1. Buscar página com includes
  const pageWithDetails = await prisma.page.findUnique({
    where: { slug },
    include: {
      owner: true,
      theme: {
        include: {
          background: true,
          button: true,
        }
      },
      links: {
        where: { active: true },
        orderBy: { order: 'asc' }
      }
    }
  })

  if (!pageWithDetails) {
    return reply.status(404).send({ message: 'Page not found' })
  }

  // 2. Converter para PageDetails usando mapper
  const details = PrismaPageMapper.toDetails(pageWithDetails)

  // 3. Formatar resposta usando presenter
  const response = PagePresenter.toHTTPWithDetails(details)

  return reply.status(200).send(response)
}
```

### Exemplo 2: Buscar múltiplas páginas com detalhes

```typescript
export async function getUserPages(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user.sub

  // 1. Buscar páginas com includes
  const pagesWithDetails = await prisma.page.findMany({
    where: { ownerId: userId },
    include: {
      owner: true,
      theme: {
        include: {
          background: true,
          button: true,
        }
      },
      links: {
        where: { active: true },
        orderBy: { order: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  // 2. Converter para lista de PageDetails usando mapper
  const detailsList = PrismaPageMapper.toDetailsList(pagesWithDetails)

  // 3. Formatar resposta usando presenter
  const response = PagePresenter.toHTTPListWithDetails(detailsList)

  return reply.status(200).send({
    pages: response,
    total: response.length
  })
}
```

## Métodos disponíveis no PagePresenter

### `toHTTP(page: Page): PagePresenterOutput`
Retorna apenas dados básicos da página (sem owner, theme, links).

**Uso:**
```typescript
const page = await pagesRepository.findById(id)
const response = PagePresenter.toHTTP(page)
```

### `toHTTPWithOwner(page: Page): PagePresenterWithOwnerOutput`
Retorna dados básicos da página + ownerId.

**Uso:**
```typescript
const page = await pagesRepository.findById(id)
const response = PagePresenter.toHTTPWithOwner(page)
```

### `toHTTPWithDetails(details: PageDetails): PagePresenterWithDetailsOutput` ⭐
Retorna página completa com owner, theme (background + button) e links.

**Uso:**
```typescript
const pageWithDetails = await prisma.page.findUnique({
  where: { id },
  include: { owner: true, theme: { include: { background: true, button: true } }, links: true }
})
const details = PrismaPageMapper.toDetails(pageWithDetails)
const response = PagePresenter.toHTTPWithDetails(details)
```

### `toHTTPListWithDetails(detailsList: PageDetails[]): PagePresenterWithDetailsOutput[]` ⭐
Converte lista de PageDetails para lista formatada.

**Uso:**
```typescript
const pagesWithDetails = await prisma.page.findMany({ include: { ... } })
const detailsList = PrismaPageMapper.toDetailsList(pagesWithDetails)
const response = PagePresenter.toHTTPListWithDetails(detailsList)
```

## Fluxo completo

```
Prisma Query → PrismaPageMapper → PagePresenter → Response HTTP
     ↓               ↓                   ↓              ↓
  Raw Data      PageDetails          Formatted      JSON
```

1. **Prisma Query**: Busca dados com `include`
2. **PrismaPageMapper**: Converte para `PageDetails` (entidade + dados relacionados)
3. **PagePresenter**: Formata para resposta HTTP padronizada
4. **Response**: Retorna JSON formatado para o cliente
