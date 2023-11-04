import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../repositories/in-memory/in-memory-users-repository'

import { hash } from 'bcrypt'
import { AuthenticateUseCase } from './authenticate.usecase'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be to able to authenticate with email', async () => {
    await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })
    const { user } = await sut.execute({
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should be to able to authenticate with username', async () => {
    await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      username: 'testedasilva',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be to able to authenticate with invalid email', async () => {
    await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      sut.execute({
        email: 'testedasilva02@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be to able to authenticate with invalid username', async () => {
    await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      sut.execute({
        username: 'testedasilva02',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be to able to authenticate with invalid password', async () => {
    await usersRepository.create({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password_hash: await hash('123456', 6),
    })

    expect(
      sut.execute({
        username: 'testedasilva',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
