# PrismaPageMapper - Documentação

## Visão Geral

O `PrismaPageMapper` agora suporta mapeamento de páginas com detalhes completos, incluindo owner, theme (com background e button), e links.

## Métodos Disponíveis

### `toDomain(raw: PrismaPage): Page`
Converte um registro bruto do Prisma para entidade de domínio `Page`.

**Uso:**
```typescript
const page = await prisma.page.findUnique({ where: { id } })
const domainPage = PrismaPageMapper.toDomain(page)
```

### `toPrisma(page: Page): Prisma.PageUncheckedCreateInput`
Converte entidade de domínio `Page` para formato Prisma.

**Uso:**
```typescript
const prismaData = PrismaPageMapper.toPrisma(domainPage)
await prisma.page.create({ data: prismaData })
```

### `toDetails(raw: PageWithDetails): PageDetails` ⭐ NOVO
Converte um registro do Prisma com includes relacionados em um objeto `PageDetails` estruturado.

**Retorna:**
```typescript
interface PageDetails {
  page: Page                    // Entidade de domínio
  owner?: {                     // Informações do proprietário
    id: string
    username: string
    email: string
  }
  theme?: {                     // Tema completo
    id: string
    title: string
    key?: string | null
    editable?: boolean | null
    luminance?: string | null
    typeface?: any
    socialStyle?: any
    heading?: any
    footer?: any
    background?: {              // Background do tema
      id: string
      type: string
      gradientStart?: string | null
      gradientEnd?: string | null
      gradientDirection?: string | null
      imageUrl?: string | null
      videoUrl?: string | null
      style?: string | null
      className?: string | null
      properties?: any
      noise?: boolean | null
    }
    button?: {                  // Button do tema
      id: string
      style: string
      className?: string | null
      properties?: any
    }
  }
  links?: Array<{               // Links da página
    id: string
    url: string
    order: number
    title?: string | null
    thumbnailUrl?: string | null
    clickCount: number
    highlightEffect?: string | null
    scheduledStart?: Date | null
    scheduledEnd?: Date | null
    type: string
    isLocked: boolean
    active: boolean
  }>
}
```

**Exemplo de uso:**
```typescript
// 1. Buscar página com detalhes completos
const pageWithDetails = await prisma.page.findUnique({
  where: { slug: 'my-page' },
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

// 2. Converter para formato estruturado
const details = PrismaPageMapper.toDetails(pageWithDetails)

// 3. Usar os dados estruturados
console.log(details.page.slug)                    // Entidade de domínio
console.log(details.owner?.username)              // Dados do owner
console.log(details.theme?.background?.type)      // Background do tema
console.log(details.links?.length)                // Quantidade de links
```

### `toDetailsList(raw: PageWithDetails[]): PageDetails[]`
Converte uma lista de registros com includes em lista de `PageDetails`.

**Exemplo de uso:**
```typescript
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
  }
})

const detailsList = PrismaPageMapper.toDetailsList(pagesWithDetails)
```

## Exemplo Completo em Controller

```typescript
import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { PrismaPageMapper } from '@/repositories/prisma/mappers/prisma-page-mapper'

export async function getPageDetails(
  request: FastifyRequest<{ Params: { slug: string } }>,
  reply: FastifyReply
) {
  const { slug } = request.params

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

  const details = PrismaPageMapper.toDetails(pageWithDetails)

  return reply.status(200).send(details)
}
```

## Benefícios

1. **Tipagem Forte**: TypeScript garante que todos os campos estão corretamente tipados
2. **Separação de Responsabilidades**: Mapper lida com transformação de dados
3. **Reutilizável**: Pode ser usado em qualquer lugar que precise de detalhes de página
4. **Flexível**: Suporta dados opcionais (owner, theme, links podem ser null/undefined)
5. **Estruturado**: Retorna dados organizados e fáceis de consumir no frontend

## Notas Importantes

- O método `toDetails` não faz queries ao banco - espera que os dados já tenham sido carregados com `include`
- Campos opcionais (owner, theme, links) só aparecem se foram incluídos na query
- A entidade de domínio `Page` é sempre retornada em `details.page`
- Links são automaticamente filtrados e ordenados se você incluir essas cláusulas no Prisma query
