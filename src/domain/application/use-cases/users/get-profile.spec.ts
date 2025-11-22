import { beforeEach, describe, expect, it } from 'vitest'
import { ProfileUseCase } from './get-profile.usecase'
import { hash } from 'bcrypt'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { makeInMemoryRepositories } from '../../../../repositories/in-memory/factories/make-in-memory-repositories'
import { InMemoryUsersRepository } from '../../../../repositories/in-memory/in-memory-users-repository'
import { User } from 'src/domain/enterprise/entities/user.entity'
import { makeUser } from 'test/factories/make-user'

let usersRepository: InMemoryUsersRepository
let sut: ProfileUseCase

describe('Profile UseCase', () => {
  beforeEach(() => {
    const { inMemoryUsersRepository } = makeInMemoryRepositories()
    usersRepository = inMemoryUsersRepository
    sut = new ProfileUseCase(usersRepository)
  })

  it('should be to able get profile', async () => {
    const userCreated = await usersRepository.create(
      makeUser({
        password_hash: await hash('123456', 6),
        username: 'john-doe'
      }),
    )

    const { user } = await sut.execute({
      userId: userCreated.id.toString(),
    })

    expect(user.username).toBe('john-doe')
  })

  it('should not be to able get profile with wrong id', async () => {
    await expect(
      sut.execute({
        userId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
