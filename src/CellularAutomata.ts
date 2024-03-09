export class Coordinate {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class CellularAutomata {
  private grid: Cell[][];

  private liveCell = new Cell(CellState.ALIVE);
  private deadCell = new Cell(CellState.DEAD);
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.grid = this.createNewGrid(width, height);
    this.width = width;
    this.height = height;
  }

  private createNewGrid(width: number, height: number): Cell[][] {
    const grid: Cell[][] = [];
    for (let x = 0; x < width; x++) {
      grid.push([]);
      for (let y = 0; y < height; y++) {
        grid[x].push(this.deadCell);
      }
    }
    return grid;
  }

  setCellState(coords: Coordinate, state: CellState) {
    switch (state) {
      case CellState.ALIVE:
        this.grid[coords.x][coords.y] = this.liveCell;
        break;
      case CellState.DEAD:
        this.grid[coords.x][coords.y] = this.deadCell;
        break;
    }
  }

  step(
    stepFunction: (
      coordinate: Coordinate,
      grid: CellularAutomata,
      cell: Cell
    ) => boolean
  ) {
    this.grid.forEach((row, x) =>
      row.forEach((_, y) => {
        const coord = new Coordinate(x, y);
        const isAlive = stepFunction(coord, this, this.getCell(coord));
        this.setCellState(coord, isAlive ? CellState.ALIVE : CellState.DEAD);
      })
    );
  }

  getCell(coord: Coordinate) {
    if (
      coord.x < 0 ||
      coord.x >= this.width ||
      coord.y < 0 ||
      coord.y >= this.height
    ) {
      return this.deadCell;
    }
    return this.grid[coord.x][coord.y];
  }

  getGrid() {
    return this.grid;
  }
}

export enum CellState {
  ALIVE,
  DEAD,
}
class Cell {
  private _state: CellState;

  constructor(state: CellState = CellState.DEAD) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
}
