import { Prisma, User } from '@prisma/client'
import {
  FindByEmailOrUsernameParams,
  UsersRepository,
} from '../user-repository'
import { randomUUID } from 'crypto'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmailOrUsername({
    email,
    username,
  }: FindByEmailOrUsernameParams) {
    const userMemory = this.items.find(
      (user) => email === user.email || username === user.username,
    )

    if (!userMemory) {
      return null
    }

    return userMemory
  }

  async findById(id: string) {
    const userMemory = this.items.find((user) => id === user.id)

    if (!userMemory) {
      return null
    }

    return userMemory
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: randomUUID(),
      username: data.username,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.items.push(user)

    return user
  }
}
