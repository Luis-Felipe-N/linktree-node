import { UsersRepository } from '../../repositories/user-repository'

interface CheckUsernameExistsUseCaseRequest {
  username: string
}

type CheckUsernameExistsUseCaseResponse = boolean

export class CheckUsernameExistsUseCaseUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ username }: CheckUsernameExistsUseCaseRequest): Promise<CheckUsernameExistsUseCaseResponse> {
    const user = await this.usersRepository.findByEmailOrUsername({username: username})

    return !!user
  }
}
