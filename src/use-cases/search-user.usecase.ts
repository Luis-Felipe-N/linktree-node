import { UsersRepository } from '../repositories/user-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface SearchUserRequest {
  username?: string
  email?: string
}

interface SearchUserResponse {
  user: User
}

export class SearchUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    username,
    email,
  }: SearchUserRequest): Promise<SearchUserResponse> {
    const user = await this.usersRepository.findByEmailOrUsername({
      email,
      username,
    })

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
