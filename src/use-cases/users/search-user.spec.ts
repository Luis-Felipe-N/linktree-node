import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'

import { hash } from 'bcrypt'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { SearchUserUseCase } from './search-user.usecase'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: SearchUserUseCase

describe('Search User UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new SearchUserUseCase(usersRepository)
  })

  it('should be to able search user by username', async () => {
    const userMaked = makeUser({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await usersRepository.create(userMaked)

    const { existing } = await sut.execute({
      username: 'testedasilva',
    })

    expect(existing).toBe(true)
  })

  it('should be to able search user by email', async () => {
    const userMaked = makeUser({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })
    const userCreated = await usersRepository.create(userMaked)

    const { existing } = await sut.execute({
      email: 'testedasilva01@gmail.com',
    })

    expect(existing).toBe(true)
  })

  it('should not be to able get profile with wrong username', async () => {
    const { existing } = await sut.execute({
      username: 'non-exists-username',
    })

    expect(existing).toBe(false)
  })

  it('should not be to able get profile with wrong email', async () => {
    const { existing } = await sut.execute({
      email: 'non-exists-email',
    })
    expect(existing).toBe(false)
  })

})
