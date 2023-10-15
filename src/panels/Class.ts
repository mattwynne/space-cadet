export class Source {
  public constructor(public readonly path: string) {}
}

class UnknownPosition {
  public get x(): number {
    throw new Error("unknown")
  }
  public get y(): number {
    throw new Error("unknown")
  }
}

export class Position {
  static unknown: Position = new UnknownPosition()
  public constructor(public readonly x: number, public readonly y: number) {}
}

export class Class {
  public constructor(
    public readonly name: string,
    public readonly source: Source,
    public position: Position | null
  ) {}
}
