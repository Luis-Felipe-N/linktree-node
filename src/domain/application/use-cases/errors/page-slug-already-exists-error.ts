export class PageSlugAlreadyExistsError extends Error {
  constructor() {
    super('Page slug already exists.')
  }
}