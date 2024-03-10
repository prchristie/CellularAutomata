import {
  CanvasHTMLAttributes,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import { CellState, CellularAutomata, Coordinate } from "./CellularAutomata";

const useInterval = (cb: () => void, timeout: number) => {
  useEffect(() => {
    console.log(timeout);
    if (timeout <= 0 || timeout === Infinity) {
      return;
    }

    const interval = setInterval(() => cb(), timeout);
    return () => {
      clearInterval(interval);
    };
  }, [cb, timeout]);
};

const drawCell = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
  ctx.fillRect(x * 3, y * 3, 3, 3);
};

function getMousePos(
  canvas: HTMLCanvasElement,
  evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((evt.clientX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((evt.clientY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}

const gameOfLifeRules = (CA: CellularAutomata) =>
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

function App() {
  const [fps, setFps] = useState(0);

  const cellularAutomata = useRef(new CellularAutomata(255, 255));
  const [mouseDown, setMouseDown] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);

  useInterval(() => gameOfLifeRules(cellularAutomata.current), 1000 / fps);

  const draw: drawFnType = (ctx) => {
    cellularAutomata.current.getGrid().forEach((row, x) =>
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

  return (
    <>
      <Canvas2D
        drawFn={useCallback(draw, [])}
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
        onMouseMove={(event) => {
          if (!canvas?.current) return;
          const { x, y } = getMousePos(canvas.current, event);
          const ctx = canvas.current.getContext("2d");
          ctx!.fillStyle = "white";
          drawCell(canvas.current.getContext("2d")!, x, y);
          if (!mouseDown) return;
          cellularAutomata.current.setCellState(
            new Coordinate(Math.round(x), Math.round(y)),
            CellState.ALIVE
          );
        }}
        canvasRef={canvas}
        width={255 * 3}
        height={255 * 3}
        fps={30}
        style={{ cursor: "none" }}
      />
      <input
        type="number"
        value={fps}
        onChange={(e) => setFps(Number(e.target.value))}
      />
    </>
  );
}

type drawFnType = (ctx: CanvasRenderingContext2D, frameCount: number) => void;

const Canvas2D = (
  props: {
    drawFn: drawFnType;
    fps: number;
    canvasRef: RefObject<HTMLCanvasElement>;
  } & CanvasHTMLAttributes<HTMLCanvasElement>
) => {
  const { drawFn, fps, canvasRef } = props;

  useCanvasAnimation(canvasRef, drawFn, fps);

  return <canvas ref={canvasRef} {...props} />;
};

export default App;
function useCanvasAnimation(
  canvasRef: RefObject<HTMLCanvasElement>,
  drawFn: drawFnType,
  fps: number
) {
  const frameCount = useRef(0);

  useInterval(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    frameCount.current++;
    window.requestAnimationFrame(() => drawFn(context, frameCount.current));
  }, 1000 / fps);
}
