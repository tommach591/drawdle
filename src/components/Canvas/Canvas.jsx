import { useState, useEffect, useRef } from "react";
import "./Canvas.css";

function Canvas() {
  const canvasRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [canvasCTX, setCanvasCTX] = useState(null);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(10);

  const offset = 0.75;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth * offset;
    canvas.height = window.innerHeight * offset;
    setCanvasCTX(ctx);
  }, [canvasRef]);

  const setPos = (event) => {
    const localX = event.clientX - event.target.offsetLeft;
    const localY = event.clientY - event.target.offsetTop;
    setMouseData({
      x: localX,
      y: localY,
    });
  };

  const Draw = (event) => {
    if (event.buttons !== 1) return;
    const ctx = canvasCTX;
    const localX = event.clientX - event.target.offsetLeft;
    const localY = event.clientY - event.target.offsetTop;
    ctx.beginPath();
    ctx.moveTo(mouseData.x, mouseData.y);
    setMouseData({
      x: localX,
      y: localY,
    });
    ctx.lineTo(localX, localY);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  return (
    <div className="Canvas">
      <canvas
        ref={canvasRef}
        onMouseEnter={(event) => setPos(event)}
        onMouseMove={(event) => {
          setPos(event);
          Draw(event);
        }}
        onMouseDown={(event) => {
          setPos(event);
          Draw(event);
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
      </div>
    </div>
  );
}

export default Canvas;
