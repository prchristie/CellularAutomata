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
import { AnimatedCanvas2D, drawFnType } from "./components/Canvas2D";

const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillRect(x * 3, y * 3, 3, 3);
};

const defaultDimensions = 200;

const gol = gameOfLifeRules();
function App() {
  const [dimensions, setDimensions] = useState(defaultDimensions);
  const [desiredFps, setDesiredFps] = useState(0);
  const lastTime = useRef(performance.now());
  const cellularAutomata = useCellularAutomata(dimensions, dimensions);
  const [mouseDown, setMouseDown] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [stepFn, setStepFn] = useState(() => gol);

  useInterval((frameCount) => {
    const logFps = () => {
      const time = performance.now();
      const diff = time - lastTime.current;
      const fps = 1000 / diff;
      console.log(fps);
    };

    if (frameCount % 60 === 0) {
      logFps();
    }
    lastTime.current = performance.now();

    cellularAutomata.step(stepFn);
  }, 1000 / desiredFps);

  useEffect(() => {
    randomizeCA(cellularAutomata);
  }, [cellularAutomata]);

  const draw: drawFnType = (ctx) => {
    const modifiedCells = cellularAutomata.getModifiedCells();

    modifiedCells.forEach((coord1d) => {
      const coord = Coordinate.from1D(coord1d, dimensions);
      const cell = cellularAutomata.getCell(coord);
      switch (cell.state) {
        case CellState.ALIVE:
          ctx.fillStyle = "white";
          break;
        case CellState.DEAD:
          ctx.fillStyle = "black";
          break;
      }
      drawCell(ctx, coord.x, coord.y);
    });

    cellularAutomata.resetModifiedCells();
  };

  const handleMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (
    event
  ) => {
    if (!canvas?.current) {
      return;
    }
    if (!mouseDown) return;
    const { x, y } = getMousePos(canvas.current, event.clientX, event.clientY);
    cellularAutomata.setCellState(
      new Coordinate(Math.round(x / 3), Math.round(y / 3)),
      CellState.ALIVE
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row h-screen">
        <AnimatedCanvas2D
          drawFn={useCallback(draw, [cellularAutomata, dimensions])}
          onMouseDown={() => setMouseDown(true)}
          onMouseUp={() => setMouseDown(false)}
          onMouseMove={handleMouseMove}
          canvasRef={canvas}
          width={dimensions}
          height={dimensions}
          fps={15}
          className="w-screen md:w-2/3 bg-black"
        />
        <Menu
          fps={desiredFps}
          setFps={setDesiredFps}
          setDimensions={setDimensions}
          dimensions={dimensions}
          cellularAutomata={cellularAutomata}
          setStepFunction={(fn) => {
            setStepFn(() => fn);
          }}
        />
      </div>
    </div>
  );
}

export default App;
