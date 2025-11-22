import { Link } from 'src/domain/enterprise/entities/link.entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'
import type { LinksRepository } from 'src/repositories/link-repository'
import type { PagesRepository } from 'src/repositories/page-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UnauthorizedError } from '../errors/unauthorized-error'

interface AddLinkToPageUseCaseRequest {
  userId: string
  pageId: string
  url: string
  title?: string
  thumbnailUrl?: string
  highlightEffect?: string
  scheduledStart?: Date
  scheduledEnd?: Date
  type?: string
}

interface AddLinkToPageUseCaseResponse {
  link: Link
}

export class AddLinkToPageUseCase {
  constructor(
    private linksRepository: LinksRepository,
    private pagesRepository: PagesRepository,
  ) { }

  async execute({
    userId,
    pageId,
    url,
    title,
    thumbnailUrl,
    highlightEffect,
    scheduledStart,
    scheduledEnd,
    type,
  }: AddLinkToPageUseCaseRequest): Promise<AddLinkToPageUseCaseResponse> {
    // Verificar se a página existe
    const page = await this.pagesRepository.findById(pageId)

    if (!page) {
      throw new ResourceNotFoundError()
    }

    // Verificar se o usuário é o dono da página
    if (page.ownerId.toString() !== userId) {
      throw new UnauthorizedError()
    }

    // Buscar links existentes para determinar a ordem
    const existingLinks = await this.linksRepository.findByPageId(pageId)
    const nextOrder = existingLinks.length

    // Criar o novo link
    const link = Link.create({
      pageId: new UniqueEntityID(pageId),
      url,
      title,
      thumbnailUrl,
      highlightEffect,
      scheduledStart,
      scheduledEnd,
      type,
      order: nextOrder,
    })

    const createdLink = await this.linksRepository.create(link)

    return {
      link: createdLink,
    }
  }
}
