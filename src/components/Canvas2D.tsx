import { CanvasHTMLAttributes, RefObject, useRef } from "react";
import { useInterval } from "@/lib/utils";

export type drawFnType = (
  ctx: CanvasRenderingContext2D,
  frameCount: number
) => void;

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

export const Canvas2D = (
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
