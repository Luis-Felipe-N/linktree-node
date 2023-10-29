import { hash } from 'bcrypt'
import { UsersRepository } from '../repositories/user-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface RegisterUserRequest {
  username: string
  email: string
  password: string
}

interface RegisterUserResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private UsersRepository: UsersRepository) {}

  async execute({
    username,
    email,
    password,
  }: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Request datas in usecase and make the logic to register user
    const password_hashed = await hash(password, 6)

    const userAlreadyExists = await this.UsersRepository.findByEmailOrUsername({
      email,
      username,
    })

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.UsersRepository.create({
      email,
      username,
      password_hash: password_hashed,
    })

    return { user }
  }
}
