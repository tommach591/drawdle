import { useState, useEffect, useRef } from "react";
import "./Canvas.css";

function Canvas() {
  const canvasRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [canvasCTX, setCanvasCTX] = useState(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(5);

  const [undo, setUndo] = useState([[]]);
  const [redo, setRedo] = useState([]);

  const width = 1024;
  const height = 768;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    setCanvasCTX(ctx);
  }, [canvasRef]);

  useEffect(() => {
    const ctx = canvasCTX;
    if (ctx)
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (const stroke of undo) {
      for (const point of stroke) {
        ctx.beginPath();
        ctx.moveTo(point.x_start, point.y_start);
        ctx.lineTo(point.x_end, point.y_end);
        ctx.strokeStyle = point.color;
        ctx.lineWidth = point.size;
        ctx.lineCap = "round";
        ctx.stroke();
      }
    }
  }, [undo, canvasCTX]);

  const setPos = (event) => {
    const localX = event.clientX - event.target.offsetLeft;
    const localY = event.clientY - event.target.offsetTop;
    setMouseData({
      x: localX,
      y: localY,
    });
  };

  const draw = (event) => {
    if (event.buttons !== 1) return;
    let newUndo = [...undo];
    const localX = event.clientX - event.target.offsetLeft;
    const localY = event.clientY - event.target.offsetTop;

    let point = {
      x_start: mouseData.x,
      y_start: mouseData.y,
      x_end: localX,
      y_end: localY,
      color: color,
      size: size,
    };

    newUndo[newUndo.length - 1].push(point);
    setUndo(newUndo);
  };

  const handleUndo = () => {
    let newUndo = [...undo];
    newUndo.pop();
    if (newUndo.length > 0) {
      let stroke = newUndo.pop();
      let newRedo = [...redo];
      newRedo.push(stroke);
      setRedo(newRedo);
    }
    newUndo.push([]);
    setUndo(newUndo);
  };

  const handleRedo = () => {
    let newUndo = [...undo];
    let newRedo = [...redo];

    if (newRedo.length > 0) {
      newUndo.pop();
      newUndo.push(newRedo.pop());
      newUndo.push([]);
      setUndo(newUndo);
      setRedo(newRedo);
    }
  };

  return (
    <div className="Canvas">
      <canvas
        ref={canvasRef}
        onMouseEnter={(event) => setPos(event)}
        onMouseMove={(event) => {
          setPos(event);
          draw(event);
        }}
        onMouseDown={(event) => {
          setRedo([]);
          setPos(event);
          draw(event);
        }}
        onMouseUp={() => {
          setUndo([...undo, []]);
        }}
      />

      <div className="Controls">
        <input
          className="Size"
          type="range"
          value={size}
          max={40}
          step={1}
          onChange={(event) => {
            setSize(event.target.value);
          }}
        />
        <input
          className="Color"
          type="color"
          value={color}
          onChange={(event) => {
            setColor(event.target.value);
          }}
        />
        <div className="History">
          <button
            onClick={() => {
              handleUndo();
            }}
          >
            Undo
          </button>
          <button
            onClick={() => {
              handleRedo();
            }}
          >
            Redo
          </button>
        </div>
        <button
          className="Clear"
          onClick={() => {
            const response = window.confirm("Clear canvas?");
            if (response) {
              const ctx = canvasCTX;
              ctx.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              );
            }
          }}
        >
          Clear
        </button>
        <button>Submit</button>
      </div>
    </div>
  );
}

export default Canvas;
