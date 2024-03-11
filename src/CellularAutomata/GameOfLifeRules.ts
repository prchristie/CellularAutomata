import { CellState, Coordinate, StepFunction } from "./CellularAutomata";

export const gameOfLifeRules = (): StepFunction => (coord, grid, cell) => {
  const directions = [-1, 0, 1];
  let liveNeighbours = 0;
  for (const x of directions) {
    for (const y of directions) {
      if (x === 0 && y === 0) {
        continue;
      }
      const cell = grid.getCell(new Coordinate(coord.x + x, coord.y + y));
      if (cell.state === CellState.ALIVE) {
        liveNeighbours++;
      }
    }
  }
  if (cell.state === CellState.ALIVE) {
    if (liveNeighbours < 2 || liveNeighbours > 3) {
      return CellState.DEAD;
    }
    return CellState.ALIVE;
  }

  if (liveNeighbours === 3) {
    return CellState.ALIVE;
  }
  return CellState.DEAD;
};
