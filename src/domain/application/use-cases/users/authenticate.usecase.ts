import { compare } from 'bcrypt'
import { UsersRepository } from '../../../../repositories/user-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'
import type { User } from 'src/domain/enterprise/entities/user.entity'


interface AuthenticateRequest {
  username?: string
  email?: string
  password: string
}

interface AuthenticateResponse {
  user: User
}

export class AuthenticateUseCase {
  constructor(private usersRepository: UsersRepository) { }

  async execute({
    username,
    email,
    password,
  }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.usersRepository.findByEmailOrUsername({
      email,
      username,
    })

    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesNotMatchPassword = await compare(password, user.password_hash!)

    if (!doesNotMatchPassword) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
