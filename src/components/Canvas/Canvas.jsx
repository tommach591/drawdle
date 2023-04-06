import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./Canvas.css";

function Canvas() {
  const defaultSize = [1, 3, 5, 10, 25, 50];
  const whiteboardRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [currentStroke, setCurrentStroke] = useState({
    color: "#000000",
    size: defaultSize[2],
    points: [],
  });

  const [keys, setKeys] = useState({
    ctrl: false,
    z: false,
    y: false,
  });

  const [undo, setUndo] = useState([]);
  const [redo, setRedo] = useState([]);

  const [width, height] = useMemo(() => [1024, 768], []);
  const canvasRef = useRef(null);
  const [canvasCTX, setCanvasCTX] = useState(null);

  const handleUndo = useCallback(() => {
    let newUndo = [...undo];
    if (newUndo.length > 0) {
      let stroke = newUndo.pop();
      let newRedo = [...redo];
      newRedo.push(stroke);
      setRedo(newRedo);
      setUndo(newUndo);
    }
  }, [undo, redo]);

  const handleRedo = useCallback(() => {
    let newUndo = [...undo];
    let newRedo = [...redo];
    if (newRedo.length > 0) {
      newUndo.push(newRedo.pop());
      setUndo(newUndo);
      setRedo(newRedo);
    }
  }, [undo, redo]);

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

    function updateCanvas() {
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        for (const stroke of [...undo, currentStroke]) {
          if (stroke.points.length > 0) {
            ctx.beginPath();
            for (const point of stroke.points) {
              ctx.moveTo(point.x_start, point.y_start);
              ctx.lineTo(point.x_end, point.y_end);
            }
            ctx.closePath();
            ctx.strokeStyle = stroke.color;
            ctx.lineWidth = stroke.size;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(updateCanvas);
    }

    animationFrameId = requestAnimationFrame(updateCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [undo, currentStroke, canvasCTX]);

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

  const setPos = (event) => {
    const localX = Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = Math.floor(event.clientY - whiteboardRef.current.offsetTop);
    setMouseData({
      x: localX,
      y: localY,
    });
  };

  const draw = (event) => {
    if (event.buttons !== 1) return;
    let newCurrentStroke = currentStroke;
    const localX = Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = Math.floor(event.clientY - whiteboardRef.current.offsetTop);

    let point = {
      x_start: mouseData.x,
      y_start: mouseData.y,
      x_end: localX,
      y_end: localY,
    };

    newCurrentStroke.points.push(point);
    setCurrentStroke(newCurrentStroke);
  };

  return (
    <div className="Canvas">
      <div
        className="Whiteboard"
        ref={whiteboardRef}
        onMouseEnter={(event) => setPos(event)}
        onMouseMove={(event) => {
          event.preventDefault();
          setPos(event);
          draw(event);
        }}
        onMouseDown={(event) => {
          event.preventDefault();
          setRedo([]);
          setPos(event);
          draw(event);
        }}
        onMouseUp={() => {
          setUndo([...undo, currentStroke]);
          setCurrentStroke({ ...currentStroke, points: [] });
        }}
      >
        <canvas className="Minicanvas" ref={canvasRef} />
        <div
          className="Paintbrush"
          style={{
            left: `${mouseData.x}px`,
            top: `${mouseData.y}px`,
            width: `${currentStroke.size}px`,
            height: `${currentStroke.size}px`,
          }}
        />
      </div>

      <div className="Controls">
        <div className="Size">
          <input
            className="Number"
            type="number"
            value={currentStroke.size}
            max={50}
            min={1}
            onChange={(event) => {
              setCurrentStroke({
                ...currentStroke,
                size: event.target.value > 50 ? 50 : event.target.value,
              });
            }}
          />
          <input
            className="Range"
            type="range"
            value={currentStroke.size}
            max={50}
            min={1}
            step={1}
            onChange={(event) => {
              setCurrentStroke({
                ...currentStroke,
                size: event.target.value > 50 ? 50 : event.target.value,
              });
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
                  setCurrentStroke({ ...currentStroke, size: size });
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
          value={currentStroke.color}
          onChange={(event) => {
            setCurrentStroke({ ...currentStroke, color: event.target.value });
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
              setUndo([]);
              setRedo([]);
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
