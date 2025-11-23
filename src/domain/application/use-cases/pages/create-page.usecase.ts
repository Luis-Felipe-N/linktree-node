import { Page } from '../../../enterprise/entities/page.entity'
import type { PagesRepository } from '../../../../repositories/page-repository'
import type { UsersRepository } from '../../../../repositories/user-repository'
import { PageSlugAlreadyExistsError } from '../errors/page-slug-already-exists-error'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UniqueEntityID } from '../../../../core/entities/unique-entity-id'

interface CreatePageUseCaseRequest {
  ownerId: string
  slug: string
  title?: string
  description?: string
  imageUrl?: string
}

interface CreatePageUseCaseResponse {
  page: Page
}

export class CreatePageUseCase {
  constructor(
    private pagesRepository: PagesRepository,
    private usersRepository: UsersRepository,
  ) { }

  async execute({
    ownerId,
    slug,
    title,
    description,
    imageUrl,
  }: CreatePageUseCaseRequest): Promise<CreatePageUseCaseResponse> {
    const user = await this.usersRepository.findById(ownerId)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    const existingPage = await this.pagesRepository.findBySlug(slug)
    if (existingPage) {
      throw new PageSlugAlreadyExistsError()
    }

    const page = Page.create({
      ownerId: new UniqueEntityID(ownerId),
      slug,
      title,
      description,
      imageUrl,
    })

    await this.pagesRepository.create(page)

    return { page }
  }
}
