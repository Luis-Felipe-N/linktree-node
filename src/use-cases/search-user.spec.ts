import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

import { hash } from 'bcrypt'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { SearchUserUseCase } from './search-user.usecase'

let usersRepository: InMemoryUsersRepository
let sut: SearchUserUseCase

describe('Search User UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new SearchUserUseCase(usersRepository)
  })

  it('should be to able search user by username', async () => {
    const userCreated = await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      username: 'testedasilva',
    })

    expect(user.id).toBe(userCreated.id)
  })

  it('should be to able search user by email', async () => {
    const userCreated = await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'testedasilva01@gmail.com',
    })

    expect(user.id).toBe(userCreated.id)
  })

  it('should not be to able get profile with wrong username', async () => {
    await expect(
      sut.execute({
        username: 'non-exists-username',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be to able get profile with wrong email', async () => {
    await expect(
      sut.execute({
        email: 'non-exists-email',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
