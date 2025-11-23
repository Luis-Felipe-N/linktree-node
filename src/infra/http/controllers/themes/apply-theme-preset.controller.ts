import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '../../../../lib/prisma'
import {
  createThemeFromPreset,
  themeToFrontendFormat,
  type FrontendThemePreset,
} from '../../../../lib/theme-preset-helpers'
import { ResourceNotFoundError } from '../../../../domain/application/use-cases/errors/resource-not-found-error'

/**
 * POST /pages/:pageId/theme/preset
 * 
 * Aplica um preset de tema completo (do frontend) a uma página.
 * Recebe um objeto AppearanceTheme e cria os registros Background, Button e Theme.
 * 
 * Body: { preset: AppearanceTheme, title: string }
 */
export async function applyThemePreset(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Verificar autenticação
  // @ts-expect-error - JWT plugin adds user to request
  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const paramsSchema = z.object({
    pageId: z.string().uuid(),
  })

  // Schema para validar o preset recebido do frontend
  const bodySchema = z.object({
    title: z.string().min(1).max(100),
    preset: z.object({
      key: z.string().optional(),
      editable: z.boolean().optional(),
      luminance: z.enum(['LIGHT', 'DARK']).optional(),
      background: z
        .object({
          type: z.string().optional(),
          color: z.string().optional(),
          style: z.string().optional(),
          gradientStart: z.string().optional(),
          gradientEnd: z.string().optional(),
          gradientDirection: z.string().optional(),
          imageUrl: z.string().optional(),
          videoUrl: z.string().optional(),
          className: z.string().optional(),
          properties: z.record(z.any()).optional(),
          noise: z.boolean().optional(),
        })
        .optional(),
      button: z
        .object({
          type: z.string().optional(),
          className: z.string().optional(),
          backgroundStyle: z
            .object({
              color: z.string().optional(),
              properties: z.record(z.any()).optional(),
            })
            .optional(),
          shadowStyle: z
            .object({
              type: z.string().optional(),
              color: z.string().optional(),
              properties: z.record(z.any()).optional(),
            })
            .optional(),
          cornerStyle: z
            .object({
              type: z.string().optional(),
              properties: z.record(z.any()).optional(),
            })
            .optional(),
          textStyle: z
            .object({
              color: z.string().optional(),
              properties: z.record(z.any()).optional(),
            })
            .optional(),
          shapeStyle: z
            .object({
              properties: z.record(z.any()).optional(),
            })
            .optional(),
        })
        .optional(),
      typeface: z
        .object({
          color: z.string().optional(),
          family: z.string().optional(),
        })
        .optional(),
      socialStyle: z
        .object({
          color: z.string().optional(),
        })
        .optional(),
      heading: z
        .object({
          type: z.string().optional(),
          logo: z.string().nullable().optional(),
          font: z.string().optional(),
          color: z.string().optional(),
          size: z.string().optional(),
          effect: z.string().optional(),
          logoSize: z.string().optional(),
        })
        .optional(),
      footer: z
        .object({
          logoUrl: z.string().nullable().optional(),
          url: z.string().nullable().optional(),
          color: z.string().nullable().optional(),
        })
        .optional(),
    }),
  })

  const paramsValidation = paramsSchema.safeParse(request.params)
  const bodyValidation = bodySchema.safeParse(request.body)

  if (!paramsValidation.success) {
    return reply
      .status(400)
      .send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() })
  }
  if (!bodyValidation.success) {
    return reply
      .status(400)
      .send({ message: 'Invalid preset data.', issues: bodyValidation.error.format() })
  }

  const { pageId } = paramsValidation.data
  const { title, preset } = bodyValidation.data

  try {
    // Verificar se a página existe e se o usuário é dono
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      include: { theme: true },
    })

    if (!page) {
      throw new ResourceNotFoundError()
    }

    // @ts-expect-error - JWT plugin adds user to request
    if (page.ownerId !== request.user.sub) {
      return reply.status(403).send({ message: 'Forbidden: You do not own this page.' })
    }

    // Se já existe um tema, deletar (ou você pode optar por atualizar)
    if (page.theme) {
      // Opcional: deletar background e button antigos se não forem reutilizados
      await prisma.theme.delete({ where: { id: page.theme.id } })
    }

    // Criar o novo tema a partir do preset
    const theme = await createThemeFromPreset(prisma, pageId, preset, title)

    // Converter para o formato do frontend
    const frontendTheme = themeToFrontendFormat(theme)

    return reply.status(201).send({ theme: frontendTheme })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}
