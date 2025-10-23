import { User, UserProps } from '@/domain/enterprise/entities/user.entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      username: faker.internet.username(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      ...override,
    },
    id,
  )

  return user
}
