import { InMemoryBackgroundRepository } from '../in-memory-background-repository'
import { InMemoryButtonRepository } from '../in-memory-button-repository'
import { InMemoryThemesRepository } from '../in-memory-themes-repository'
import { InMemoryUsersRepository } from '../in-memory-users-repository'

interface InMemoryRepositories {
  inMemoryUsersRepository: InMemoryUsersRepository
  inMemoryThemesRepository: InMemoryThemesRepository
  inMemoryButtonRepository: InMemoryButtonRepository
  inMemoryBackgroundRepository: InMemoryBackgroundRepository
}

export function makeInMemoryRepositories(): InMemoryRepositories {
  const inMemoryUsersRepository = new InMemoryUsersRepository()
  const inMemoryThemesRepository = new InMemoryThemesRepository()
  const inMemoryButtonRepository = new InMemoryButtonRepository()
  const inMemoryBackgroundRepository = new InMemoryBackgroundRepository()

  return {
    inMemoryUsersRepository,
    inMemoryThemesRepository,
    inMemoryButtonRepository,
    inMemoryBackgroundRepository,
  }
}
