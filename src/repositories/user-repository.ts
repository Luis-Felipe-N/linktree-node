import type { User } from "@/domain/enterprise/entities/user.entity"


export interface FindByEmailOrUsernameParams {
  email?: string
  username?: string
}

export interface UsersRepository {
  create(data: User): Promise<User>
  findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams): Promise<User | null>
  findById(userId: string): Promise<User | null>
}
