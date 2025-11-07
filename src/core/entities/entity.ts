import { UniqueEntityID } from './unique-entity-id'

export class Entity<T> {
  private id: UniqueEntityID
  protected props: T

  get id() {
    return this.id
  }

  constructor(props: T, id?: UniqueEntityID) {
    this.id = id ?? new UniqueEntityID(id)
    this.props = props
  }
}