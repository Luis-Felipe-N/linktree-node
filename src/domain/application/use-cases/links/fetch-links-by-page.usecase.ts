import type { Link } from "../../../enterprise/entities/link.entity"
import type { LinksRepository } from "../../../../repositories/link-repository"

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