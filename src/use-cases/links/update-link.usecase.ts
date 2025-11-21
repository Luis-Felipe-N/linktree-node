import type { Link } from '@/domain/enterprise/entities/link.entity'
import type { LinksRepository } from '@/repositories/link-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'
import type { PagesRepository } from '@/repositories/page-repository'

interface UpdateLinkUseCaseRequest {
  linkId: string
  userId: string
  url?: string
  title?: string | null
  thumbnailUrl?: string | null
  highlightEffect?: string | null
  scheduledStart?: Date | null
  scheduledEnd?: Date | null
  active?: boolean
  order?: number
}

interface UpdateLinkUseCaseResponse {
  link: Link
}

export class UpdateLinkUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private pagesRepository: PagesRepository,
  ) { }

  async execute({
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
  }: UpdateLinkUseCaseRequest): Promise<UpdateLinkUseCaseResponse> {
    const link = await this.linksRepository.findById(linkId)

    if (!link) {
      throw new ResourceNotFoundError()
    }

    // Verifica se o usuário é dono da página à qual o link pertence
    const page = await this.pagesRepository.findById(link.pageId.toString())

    if (!page) {
      throw new ResourceNotFoundError()
    }

    if (page.ownerId.toString() !== userId) {
      throw new UnauthorizedError()
    }

    // Atualiza apenas os campos fornecidos
    if (url !== undefined) link.url = url
    if (title !== undefined) link.title = title
    if (thumbnailUrl !== undefined) link.thumbnailUrl = thumbnailUrl
    if (highlightEffect !== undefined) link.highlightEffect = highlightEffect
    if (scheduledStart !== undefined) link.scheduledStart = scheduledStart
    if (scheduledEnd !== undefined) link.scheduledEnd = scheduledEnd
    if (active !== undefined) link.active = active
    if (order !== undefined) link.order = order

    const updatedLink = await this.linksRepository.update(link)

    return {
      link: updatedLink,
    }
  }
}
