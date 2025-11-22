import type { Link } from "src/domain/enterprise/entities/link.entity"
import type { LinksRepository } from "src/repositories/link-repository"

interface FetchLinksByPageUseCaseRequest {
  pageId: string
}

interface FetchLinksByPageUseCaseResponse {
  links: Link[]
}

export class FetchLinksByPageUseCase {
  constructor(private linksRepository: LinksRepository) { }


  async execute({
    pageId,
  }: FetchLinksByPageUseCaseRequest): Promise<FetchLinksByPageUseCaseResponse> {
    const links = await this.linksRepository.findByPageId(pageId)

    return {
      links
    }
  }
}