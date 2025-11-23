import { Entity } from '../../../core/entities/entity'
import type { UniqueEntityID } from '../../../core/entities/unique-entity-id'

export interface UserProps {
  username: string
  email: string
  password_hash: string
  created_at: Date
  updated_at?: Date | null
}

export class User extends Entity<UserProps> {
  get username() { return this.props.username }
  get email() { return this.props.email }
  get password_hash() { return this.props.password_hash } // Cuidado ao expor
  get created_at() { return this.props.created_at }
  get updated_at() { return this.props.updated_at }

  set username(username: string) {
    this.props.username = username
    this.touch()
  }

  private touch() {
    this.props.updated_at = new Date()
  }

  static create(
    props: Omit<UserProps, 'created_at' | 'updated_at'>,
    id?: UniqueEntityID,
  ) {
    const user = new User(
      {
        ...props,
        created_at: new Date(),
        updated_at: null,
      },
      id,
    )
    return user
  }
}