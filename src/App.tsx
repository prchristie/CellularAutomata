import { useCallback, useEffect, useRef, useState } from "react";
import {
  CellState,
  Coordinate,
  randomizeCA,
  useCellularAutomata,
} from "./CellularAutomata/CellularAutomata";
import { gameOfLifeRules } from "./CellularAutomata/GameOfLifeRules";
import { getMousePos, useInterval } from "./lib/utils";
import { Menu } from "./components/Menu";
import { Canvas2D, drawFnType } from "./components/Canvas2D";

const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillRect(x * 3, y * 3, 3, 3);
};

const defaultDimensions = 200;

function App() {
  const [dimensions, setDimensions] = useState(defaultDimensions);
  const [fps, setFps] = useState(0);

  const cellularAutomata = useCellularAutomata(dimensions, dimensions);
  const [mouseDown, setMouseDown] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useInterval(() => gameOfLifeRules(cellularAutomata), 1000 / fps);

  useEffect(() => randomizeCA(cellularAutomata), [cellularAutomata]);

  const draw: drawFnType = (ctx) => {
    cellularAutomata.getGrid().forEach((row, x) =>
      row.forEach((cell, y) => {
        switch (cell.state) {
          case CellState.ALIVE:
            ctx.fillStyle = "white";
            break;
          case CellState.DEAD:
            ctx.fillStyle = "black";
            break;
        }
        drawCell(ctx, x, y);
      })
    );
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!canvas?.current) {
      return;
    }
    const { x, y } = getMousePos(canvas.current, event.clientX, event.clientY);
    const ctx = canvas.current.getContext("2d");
    ctx!.fillStyle = "white";
    drawCell(canvas.current.getContext("2d")!, x / 3, y / 3);
    if (!mouseDown) return;
    cellularAutomata.setCellState(
      new Coordinate(Math.round(x / 3), Math.round(y / 3)),
      CellState.ALIVE
    );
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <Canvas2D
        drawFn={useCallback(draw, [cellularAutomata])}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onMouseMove={handleMouseMove}
        canvasRef={canvas}
        width={dimensions}
        height={dimensions}
        fps={30}
        style={{ cursor: "none" }}
        className="w-screen md:w-2/3"
      />
      <Menu
        fps={fps}
        setFps={setFps}
        setDimensions={setDimensions}
        dimensions={dimensions}
        cellularAutomata={cellularAutomata}
      />
    </div>
  );
}

export default App;
