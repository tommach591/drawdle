import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./Canvas.css";

function Canvas() {
  const defaultSize = [1, 3, 5, 10, 25, 50];
  const whiteboardRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [size, setSize] = useState(defaultSize[2]);

  const [keys, setKeys] = useState({
    ctrl: false,
    z: false,
    y: false,
  });

  const [strokeCount, setStrokeCount] = useState(0);
  const [drawHistory, setDrawHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);

  const [width, height] = useMemo(() => [1024, 768], []);
  const canvasRef = useRef(null);
  const [canvasCTX, setCanvasCTX] = useState(null);

  const startDrawing = (event) => {
    const localX = Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = Math.floor(event.clientY - whiteboardRef.current.offsetTop);

    setIsDrawing(true);
    setRedoHistory([]);
    setDrawHistory((prevHistory) => [
      ...prevHistory,
      { color: color, size: size, points: [{ x: localX, y: localY }] },
    ]);
    setStrokeCount((prevCount) => prevCount + 1);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (event) => {
    const localX = Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = Math.floor(event.clientY - whiteboardRef.current.offsetTop);
    setMouseData({
      x: localX,
      y: localY,
    });
    if (!isDrawing) return;

    setDrawHistory((prevHistory) => {
      const lastStroke = prevHistory[prevHistory.length - 1];
      lastStroke.points.push({ x: localX, y: localY });
      return [...prevHistory.slice(0, -1), lastStroke];
    });
  };

  const drawStroke = useCallback((ctx, stroke) => {
    if (stroke && stroke.points.length > 0) {
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        ctx.moveTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    const ctx = canvasCTX;
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      for (const stroke of drawHistory) {
        drawStroke(ctx, stroke);
      }
      setStrokeCount(drawHistory.length);
    }
  }, [canvasCTX, drawHistory, drawStroke]);

  const handleUndo = useCallback(() => {
    if (drawHistory.length > 0) {
      setRedoHistory((prevHistory) => [
        ...prevHistory,
        drawHistory[drawHistory.length - 1],
      ]);
      setDrawHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [drawHistory]);

  const handleRedo = useCallback(() => {
    if (redoHistory.length > 0) {
      setStrokeCount((prevCount) => prevCount + 1);
      setDrawHistory((prevHistory) => [
        ...prevHistory,
        redoHistory[redoHistory.length - 1],
      ]);
      setRedoHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [redoHistory]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    setCanvasCTX(ctx);
  }, [canvasRef, width, height]);

  useEffect(() => {
    let animationFrameId;
    const ctx = canvasCTX;
    if (strokeCount !== drawHistory.length) {
      animationFrameId = requestAnimationFrame(redrawCanvas);
    } else {
      const stroke = drawHistory[drawHistory.length - 1];
      animationFrameId = requestAnimationFrame(() => {
        drawStroke(ctx, stroke);
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasCTX, drawHistory, strokeCount, drawStroke, redrawCanvas]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newKeys = keys;
      const { key } = event;
      if (key === "Control") newKeys.ctrl = true;
      if (key === "z") newKeys.z = true;
      if (key === "y") newKeys.y = true;

      if (newKeys.ctrl && newKeys.z) handleUndo();
      if (newKeys.ctrl && newKeys.y) handleRedo();

      setKeys(newKeys);
    };

    const handleKeyUp = (event) => {
      const newKeys = keys;
      const { key } = event;
      if (key === "Control") newKeys.ctrl = false;
      if (key === "z") newKeys.z = false;
      if (key === "y") newKeys.y = false;

      setKeys(newKeys);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, handleUndo, handleRedo]);

  return (
    <div className="Canvas">
      <div
        className="Whiteboard"
        ref={whiteboardRef}
        onMouseMove={(event) => {
          event.preventDefault();
          draw(event);
        }}
        onMouseDown={(event) => {
          event.preventDefault();
          startDrawing(event);
        }}
        onMouseUp={(event) => {
          event.preventDefault();
          finishDrawing();
        }}
        onMouseLeave={(event) => {
          event.preventDefault();
          finishDrawing();
        }}
      >
        <canvas className="Minicanvas" ref={canvasRef} />
        <div
          className="Paintbrush"
          style={{
            left: `${mouseData.x}px`,
            top: `${mouseData.y}px`,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </div>

      <div className="Controls">
        <div className="Size">
          <input
            className="Number"
            type="number"
            value={size}
            max={50}
            min={1}
            onChange={(event) => {
              setSize(event.target.value > 50 ? 50 : event.target.value);
            }}
          />
          <input
            className="Range"
            type="range"
            value={size}
            max={50}
            min={1}
            step={1}
            onChange={(event) => {
              setSize(event.target.value > 50 ? 50 : event.target.value);
            }}
          />
        </div>
        <div className="SizeGrid">
          {defaultSize.map((size) => {
            return (
              <div
                className="DefaultSizes"
                key={size}
                onClick={() => {
                  setSize(size);
                }}
              >
                <div style={{ width: size, height: size }} />
                <h1>{size}</h1>
              </div>
            );
          })}
        </div>
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
            const response = window.confirm(
              "This action cannot be undone, clear canvas?"
            );
            if (response) {
              setDrawHistory([]);
              setRedoHistory([]);
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
