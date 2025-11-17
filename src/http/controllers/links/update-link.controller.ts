import type { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { UnauthorizedError } from '@/use-cases/errors/unauthorized-error'
import { LinkPresenter } from '@/http/presenters/link-presenter'
import { makeUpdateLinkUseCase } from '@/use-cases/factories/make-update-link-use-case'

export async function updateLink(request: FastifyRequest, reply: FastifyReply) {
  const updateLinkParamsSchema = z.object({
    linkId: z.string().uuid(),
  })

  const updateLinkBodySchema = z.object({
    url: z.string().url().optional(),
    title: z.string().min(1).max(100).nullable().optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
    highlightEffect: z.string().nullable().optional(),
    scheduledStart: z.coerce.date().nullable().optional(),
    scheduledEnd: z.coerce.date().nullable().optional(),
    active: z.boolean().optional(),
    order: z.number().int().min(0).optional(),
  })

  const { linkId } = updateLinkParamsSchema.parse(request.params)
  const { url, title, thumbnailUrl, highlightEffect, scheduledStart, scheduledEnd, active, order } =
    updateLinkBodySchema.parse(request.body)

  const userId = request.user.sub

  try {
    const updateLinkUseCase = makeUpdateLinkUseCase()

    const { link } = await updateLinkUseCase.execute({
      linkId,
      userId,
      url,
      title,
      thumbnailUrl,
      highlightEffect,
      scheduledStart,
      scheduledEnd,
      active,
      order,
    })

    return reply.status(200).send({
      link: LinkPresenter.toHTTP(link),
    })
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof UnauthorizedError) {
      return reply.status(403).send({ message: err.message })
    }

    throw err
  }
}
