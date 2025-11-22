import type { Page } from 'src/domain/enterprise/entities/page.entity'
import type { PagesRepository } from 'src/repositories/page-repository'

interface GetUserPagesUseCaseRequest {
  userId: string
}

interface GetUserPagesUseCaseResponse {
  pages: Page[]
}

export class GetUserPagesUseCase {
  constructor(private pagesRepository: PagesRepository) { }

  async execute({
    userId,
  }: GetUserPagesUseCaseRequest): Promise<GetUserPagesUseCaseResponse> {
    const pages = await this.pagesRepository.findByOwnerId(userId)

    return {
      pages,
    }
  }
}
