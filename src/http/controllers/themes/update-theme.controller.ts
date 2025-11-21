import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { makeUpdatePageThemeUseCase } from '@/use-cases/factories/make-update-page-theme-use-case'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { PrismaPagesRepository } from '@/repositories/prisma/prisma-page-repository'
import { ThemePresenter } from '@/http/presenters/theme-presenter'
import { PagePresenter } from '@/http/presenters/page-presenter'

export async function updateTheme(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const updateThemeParamsSchema = z.object({
    pageId: z.string().uuid(),
  })

  const updateThemeBodySchema = z.object({
    theme: z.record(z.any()),
  })

  const paramsValidation = updateThemeParamsSchema.safeParse(request.params)
  const bodyValidation = updateThemeBodySchema.safeParse(request.body)

  if (!paramsValidation.success) {
    return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() })
  }
  if (!bodyValidation.success) {
    return reply.status(400).send({ message: 'Invalid theme data.', issues: bodyValidation.error.format() })
  }

  const { pageId } = paramsValidation.data
  const { theme: themeData } = bodyValidation.data

  try {
    const pagesRepository = new PrismaPagesRepository()
    const page = await pagesRepository.findById(pageId)
    if (!page) {
      throw new ResourceNotFoundError()
    }
    if (page.ownerId.toString() !== request.user.sub) {
      return reply.status(403).send({ message: 'Forbidden: You do not own this page.' })
    }

    const updatePageThemeUseCase = makeUpdatePageThemeUseCase()
    const { theme } = await updatePageThemeUseCase.execute({
      pageId,
      ownerId: request.user.sub,
      themeData,
    })

    return reply.status(200).send({
      message: 'Theme updated successfully',
      theme: ThemePresenter.toHTTP(theme),
      page: PagePresenter.toHTTP(page),
    })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}