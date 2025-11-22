export class UserAlreadyExistsError extends Error {
  constructor() {
    super('Users already exists')
  }
}
