import { useMemo } from "react";

export class Coordinate {
  readonly x: number;
  readonly y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static from1D(ind: number, width: number) {
    return new Coordinate(Math.round(ind / width), ind % width);
  }

  to1D(width: number) {
    return this.x * width + this.y;
  }
}

export type StepFunction = (
  coordinate: Coordinate,
  grid: CellularAutomata,
  cell: Cell
) => CellState;

export class CellularAutomata {
  private grid: Cell[][];

  private liveCell = new Cell(CellState.ALIVE);
  private deadCell = new Cell(CellState.DEAD);
  width: number;
  height: number;
  nextGrid: Cell[][];
  wasModified: boolean;
  outboundModifiedCells: Set<number>;

  constructor(width: number, height: number) {
    this.grid = this.createNewGrid(width, height);
    this.nextGrid = this.createNewGrid(width, height);
    this.width = width;
    this.height = height;
    this.wasModified = false;
    // For the purpose of rendering, as the simulation may run at a different rate to the renderer
    this.outboundModifiedCells = new Set<number>();
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
    const cell = this.getCell(coords);

    this.grid[coords.x][coords.y] = this.stateToCell(state);
    // If the cell didn't change, don't do anything
    if (cell.state === state) {
      return;
    }

    this.wasModified = true;
    this.outboundModifiedCells.add(coords.to1D(this.width));
  }

  private updateCellState(coords: Coordinate, state: CellState) {
    const cell = this.getCell(coords);

    this.nextGrid[coords.x][coords.y] = this.stateToCell(state);
    // If the cell didn't change state, don't do anything
    if (cell.state === state) {
      return;
    }

    this.wasModified = true;
    this.outboundModifiedCells.add(coords.to1D(this.width));
  }

  step(stepFunction: StepFunction) {
    if (!this.wasModified) {
      return;
    }
    this.wasModified = false;

    this.grid.forEach((row, x) =>
      row.forEach((cell, y) => {
        const coord = new Coordinate(x, y);
        const cellState = stepFunction(coord, this, cell);
        this.updateCellState(coord, cellState);
      })
    );

    if (this.wasModified) this.swapGridBuffers();
  }

  getModifiedCells() {
    return this.outboundModifiedCells;
  }

  resetModifiedCells() {
    this.outboundModifiedCells = new Set();
  }

  private swapGridBuffers() {
    const mem = this.grid;
    this.grid = this.nextGrid;
    this.nextGrid = mem;
  }

  stateToCell(state: CellState) {
    switch (state) {
      case CellState.ALIVE:
        return this.liveCell;
      case CellState.DEAD:
        return this.deadCell;
    }
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

export const randomizeCA = (CA: CellularAutomata) => {
  CA.getGrid().forEach((row, x) =>
    row.forEach((_, y) => {
      CA.setCellState(
        new Coordinate(x, y),
        Math.random() < 0.5 ? CellState.ALIVE : CellState.DEAD
      );
    })
  );
};

export const useCellularAutomata = (
  width: number,
  height: number
): CellularAutomata => {
  const cellularAutomata = useMemo(
    () => new CellularAutomata(width, height),
    [width, height]
  );

  return cellularAutomata;
};
