import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { ResourceNotFoundError } from 'src/domain/application/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from 'src/domain/application/use-cases/errors/unauthorized-error'
import { LinkPresenter } from 'src/infra/http/presenters/link-presenter'
import { makeAddLinkToPageUseCase } from 'src/infra/factories/make-add-link-to-page-use-case'

export async function addLink(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user || !request.user.sub) {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }

  const addLinkParamsSchema = z.object({
    pageId: z.string().uuid(),
  })

  const addLinkBodySchema = z.object({
    url: z.string().url({ message: 'Invalid URL format.' }),
    title: z.string().max(100).optional(),
    thumbnailUrl: z.string().url().optional(),
    highlightEffect: z.string().optional(),
    scheduledStart: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    scheduledEnd: z.string().datetime().optional().transform(val => val ? new Date(val) : undefined),
    type: z.enum(['link', 'embed', 'header']).optional(),
  })

  const paramsValidation = addLinkParamsSchema.safeParse(request.params)
  const bodyValidation = addLinkBodySchema.safeParse(request.body)

  if (!paramsValidation.success) {
    return reply.status(400).send({ message: 'Invalid page ID.', issues: paramsValidation.error.format() })
  }
  if (!bodyValidation.success) {
    return reply.status(400).send({ message: 'Invalid link data.', issues: bodyValidation.error.format() })
  }

  const { pageId } = paramsValidation.data
  const { url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, type } = bodyValidation.data

  try {
    const addLinkUseCase = makeAddLinkToPageUseCase()
    const { link } = await addLinkUseCase.execute({
      userId: request.user.sub,
      pageId,
      url,
      title,
      thumbnailUrl,
      highlightEffect,
      scheduledStart,
      scheduledEnd,
      type,
    })

    return reply.status(201).send({ link: LinkPresenter.toHTTP(link) })
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: 'Page not found.' })
    }
    if (error instanceof UnauthorizedError) {
      return reply.status(403).send({ message: 'Forbidden: You do not own this page.' })
    }
    console.error(error)
    return reply.status(500).send({ message: 'Internal server error' })
  }
}