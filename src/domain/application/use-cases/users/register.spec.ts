import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register.usecase'
import { InMemoryUsersRepository } from '../../../../repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'

import { compare } from 'bcrypt'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register UseCase', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be to able to register', async () => {
    const { user } = await sut.execute({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(user.username).toEqual(expect.any(String))
  })

  it('should be to able to register with encrypted password', async () => {
    const { user } = await sut.execute({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    const passwordUserIsHashed = await compare('123456', user.password_hash!)

    return expect(passwordUserIsHashed).toBe(true)
  })

  it('should not be to able to register with email twice', async () => {
    const { user } = await sut.execute({
      username: 'testedasilva-01',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(
      sut.execute({
        username: 'testedasilva-02',
        email: 'testedasilva01@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })

  it('should not be to able to register with username twice', async () => {
    const { user } = await sut.execute({
      username: 'testedasilva',
      email: 'testedasilva01@gmail.com',
      password: '123456',
    })

    expect(
      sut.execute({
        username: 'testedasilva',
        email: 'testedasilva02@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
