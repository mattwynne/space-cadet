export class Source {
  public constructor(public readonly path: string) {}
}

export class Class {
  public constructor(public readonly name: string, public readonly source: Source) {}
}
