export class Identifier<IdentifierType = string | number> {
  #value: IdentifierType;

  constructor(value: IdentifierType) {
    this.#value = value;
  }

  public getValue(): IdentifierType {
    return this.#value;
  }

  public toString(): string {
    return String(this.#value);
  }

  public equals(id?: Identifier<IdentifierType>): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.getValue() === this.#value;
  }

  static isIdentifier(id: unknown): id is Identifier {
    return id instanceof Identifier;
  }
}
