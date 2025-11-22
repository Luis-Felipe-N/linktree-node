import { User } from 'src/domain/enterprise/entities/user.entity'

export interface UserPresenterOutput {
  id: string
  username: string
  email: string
  created_at: Date
  updated_at?: Date | null
}

export class UserPresenter {
  static toHTTP(user: User): UserPresenterOutput {
    return {
      id: user.id.toString(),
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }
  }

  static toHTTPList(users: User[]): UserPresenterOutput[] {
    return users.map(u => this.toHTTP(u))
  }
}
