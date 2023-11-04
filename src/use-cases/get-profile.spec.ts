import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'
import { ProfileUseCase } from './get-profile.usecase'
import { hash } from 'bcrypt'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: ProfileUseCase

describe('Profile UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new ProfileUseCase(usersRepository)
  })

  it('should be to able get profile', async () => {
    const userCreated = await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: userCreated.id,
    })

    expect(user.username).toBe('testedasilva')
  })

  it('should not be to able get profile with wrong id', async () => {
    await expect(
      sut.execute({
        userId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
