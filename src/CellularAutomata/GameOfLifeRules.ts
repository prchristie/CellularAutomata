import { CellState, CellularAutomata, Coordinate } from "./CellularAutomata";

export const gameOfLifeRules = (CA: CellularAutomata) =>
  CA.step((coord, grid, cell) => {
    const directions = [-1, 0, 1];
    let liveNeighbours = 0;
    for (const x of directions) {
      for (const y of directions) {
        if (x == 0 && y == 0) {
          continue;
        }
        const cell = grid.getCell(new Coordinate(coord.x + x, coord.y + y));
        if (cell.state == CellState.ALIVE) {
          liveNeighbours++;
        }
      }
    }
    if (cell.state == CellState.ALIVE) {
      if (liveNeighbours < 2 || liveNeighbours > 3) {
        return false;
      }
      return true;
    }

    if (liveNeighbours === 3) {
      return true;
    }
    return false;
  });
