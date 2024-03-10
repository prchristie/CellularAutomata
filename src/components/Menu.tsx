import {
  CellularAutomata,
  randomizeCA,
} from "../CellularAutomata/CellularAutomata";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const fpsOptions = [5, 10, 30, 60];
const dimensionOptions = [50, 100, 200, 500];

export const Menu = (props: {
  fps: number;
  setFps: (fps: number) => void;
  dimensions: number;
  setDimensions: (dims: number) => void;
  cellularAutomata: CellularAutomata;
}) => {
  const { fps, setFps, setDimensions } = props;

  const formatDimension = (dim: number) => `${dim}x${dim}`;

  return (
    <div className="w-full md:flex-1 p-3 border-border border-l-4 flex flex-col gap-10">
      <label className="flex flex-col gap-4">
        Updates per second
        <Input
          type="number"
          value={fps || ""}
          onChange={(e) => setFps(Number(e.target.value))}
        />
        <div className="flex gap-2">
          <Button onClick={() => setFps(0)}>Stop</Button>
          {fpsOptions.map((fps) => (
            <Button key={fps} onClick={() => setFps(fps)}>
              {fps}
            </Button>
          ))}
        </div>
      </label>
      <label className="flex flex-col gap-4">
        Dimensions
        <Input
          type="number"
          value={props.dimensions || ""}
          onChange={(e) => setDimensions(Number(e.target.value))}
        ></Input>
        <div className="flex gap-2">
          {dimensionOptions.map((dim) => (
            <Button key={dim} onClick={() => setDimensions(dim)}>
              {formatDimension(dim)}
            </Button>
          ))}
        </div>
      </label>
      <Button onClick={() => randomizeCA(props.cellularAutomata)}>
        Randomize
      </Button>
    </div>
  );
};
