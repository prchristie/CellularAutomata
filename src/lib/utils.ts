import { type ClassValue, clsx } from "clsx";
import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useInterval = (
  cb: (frameCount: number) => void,
  timeout: number
) => {
  const frameCount = useRef(0);
  useEffect(() => {
    if (timeout <= 0 || timeout === Infinity) {
      return;
    }

    const interval = setInterval(() => {
      frameCount.current++;
      cb(frameCount.current);
    }, timeout);
    return () => {
      clearInterval(interval);
    };
  }, [cb, timeout]);
};

export function getMousePos(
  canvas: HTMLCanvasElement,
  screenX: number,
  screenY: number
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((screenX - rect.left) / (rect.right - rect.left)) * canvas.width,
    y: ((screenY - rect.top) / (rect.bottom - rect.top)) * canvas.height,
  };
}
