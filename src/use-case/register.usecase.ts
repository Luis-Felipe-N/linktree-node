import { UserRepository } from "../repositories/user-repository"


interface RegisterUserRequest {
  username: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    username,
    email,
    password
  }: RegisterUserRequest) {
    // Request datas in usecase and make the logic to register user
    const password_hashed = password

    const user = await this.userRepository.create({email,password_hash: password_hashed, username})
  }
}