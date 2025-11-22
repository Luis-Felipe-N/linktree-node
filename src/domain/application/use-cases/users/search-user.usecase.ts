import { UsersRepository } from '../../../../repositories/user-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface SearchUserRequest {
  username?: string
  email?: string
}

interface SearchUserResponse {
  existing: boolean
}

export class SearchUserUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    username,
    email,
  }: SearchUserRequest): Promise<SearchUserResponse> {
    const user = await this.usersRepository.findByEmailOrUsername({
      email,
      username,
    })

    return { existing: !!user }
  }
}
