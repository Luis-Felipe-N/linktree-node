import { hash } from 'bcrypt'
import { UsersRepository } from '../../repositories/user-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { User } from '@/domain/enterprise/entities/user.entity'

interface RegisterUserRequest {
  username: string
  email: string
  password: string
}

interface RegisterUserResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private UsersRepository: UsersRepository) { }

  async execute({
    username,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const password_hashed = await hash(password, 6)

    const userAlreadyExists = await this.UsersRepository.findByEmailOrUsername({
      email,
      username,
    })

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const user = User.create({
      email,
      username,
      password_hash: password_hashed,
    })

    const userCreated = await this.UsersRepository.create(user)

    return { user: userCreated }
  }
}
