import { EntityId } from './entity-id';

export abstract class Entity<Props> {
  private _id: EntityId;
  protected props: Props;

  get id() {
    return this._id;
  }

  protected constructor(props: Props, id?: EntityId) {
    this.props = props;
    this._id = id ?? new EntityId(id);
  }

  public equals(entity: Entity<unknown>) {
    if (entity === this) return true;

    if (entity._id === this.id) return true;

    return false;
  }
}
