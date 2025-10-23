
import type { User } from '@/domain/enterprise/entities/user.entity'
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
    const userMemory = this.items.find((user) => id === user.id.toString())

    if (!userMemory) {
      return null
    }

    return userMemory
  }

  async create(data: User) {
    this.items.push(data)

    return data
  }
}
