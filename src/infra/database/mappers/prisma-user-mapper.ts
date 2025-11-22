import { User as PrismaUser, Prisma } from '@prisma/client'
import { User } from 'src/domain/enterprise/entities/user.entity'
import { UniqueEntityID } from 'src/core/entities/unique-entity-id'

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        username: raw.username,
        email: raw.email,
        password_hash: raw.password_hash,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      password_hash: user.password_hash,
      created_at: user.created_at,
      updated_at: user.updated_at ?? new Date(),
    }
  }

  static toDomainList(raw: PrismaUser[]): User[] {
    return raw.map(r => this.toDomain(r))
  }
}
