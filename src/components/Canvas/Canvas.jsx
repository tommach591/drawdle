import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./Canvas.css";
import {
  useBackground,
  useColor,
  useDrawHistory,
  useDrawHistoryUpdate,
  useHandleRedo,
  useHandleUndo,
  useRedoHistoryUpdate,
  useSize,
  useStrokeCount,
  useStrokeCountUpdate,
} from "../../utils/CanvasContext";

function Canvas() {
  const color = useColor();
  const size = useSize();
  const background = useBackground();
  const drawHistory = useDrawHistory();
  const setDrawHistory = useDrawHistoryUpdate();
  const setRedoHistory = useRedoHistoryUpdate();
  const strokeCount = useStrokeCount();
  const setStrokeCount = useStrokeCountUpdate();
  const handleUndo = useHandleUndo();
  const handleRedo = useHandleRedo();

  const whiteboardRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showBrush, setShowBrush] = useState(false);

  const [keys, setKeys] = useState({
    ctrl: false,
    z: false,
    y: false,
  });

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
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      for (const stroke of drawHistory) {
        drawStroke(ctx, stroke);
      }
      setStrokeCount(drawHistory.length);
    }
  }, [canvasCTX, drawHistory, drawStroke, setStrokeCount, background]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    setCanvasCTX(ctx);
  }, [canvasRef, width, height, background]);

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
    let animationFrameId = requestAnimationFrame(redrawCanvas);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [background, redrawCanvas]);

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
        onMouseEnter={(event) => {
          event.preventDefault();
          setShowBrush(true);
        }}
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
          setShowBrush(false);
          finishDrawing();
        }}
      >
        <canvas className="Minicanvas" ref={canvasRef} />
        <div
          className="Paintbrush"
          style={
            showBrush
              ? {
                  left: `${mouseData.x}px`,
                  top: `${mouseData.y}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                }
              : { display: "none" }
          }
        />
      </div>
    </div>
  );
}

export default Canvas;
