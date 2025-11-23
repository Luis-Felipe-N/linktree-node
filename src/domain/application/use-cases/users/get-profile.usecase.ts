import type { User } from '../../../enterprise/entities/user.entity'
import { UsersRepository } from '../../../../repositories/user-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

interface ProfileRequest {
  userId: string
}

interface ProfileResponse {
  user: User
}

export class ProfileUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({ userId }: ProfileRequest): Promise<ProfileResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
