interface IResolution {
  width?: number;
  height?: number;
}

export class Resolution implements IResolution {
  public width?: number;
  public height?: number;
  constructor(resolution: IResolution) {
    this.width = resolution.width;
    this.height = resolution.height;
  }

  public getResolution(): string {
    return this.width && this.height ? `${this.width}x${this.height}` : '0x0';
  }
}
