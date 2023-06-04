import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import "./Canvas.css";
import {
  useSecondary,
  usePrimary,
  useDrawHistory,
  useDrawHistoryUpdate,
  useHandleRedo,
  useHandleUndo,
  useRedoHistoryUpdate,
  useRedraw,
  useRedrawUpdate,
  useSize,
  useTool,
  useUpdateColorHistory,
} from "../../utils/DrawdleContext";
import { useMobile } from "../../utils/useMobile";

function Canvas() {
  const primary = usePrimary();
  const secondary = useSecondary();
  const size = useSize();
  const drawHistory = useDrawHistory();
  const setDrawHistory = useDrawHistoryUpdate();
  const setRedoHistory = useRedoHistoryUpdate();
  const handleUndo = useHandleUndo();
  const handleRedo = useHandleRedo();
  const redraw = useRedraw();
  const setRedraw = useRedrawUpdate();
  const tool = useTool();
  const updateColorHistory = useUpdateColorHistory();

  const BRUSH = 0;

  const isMobile = useMobile();
  const whiteboardRef = useRef(null);
  const [mouseData, setMouseData] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [showBrush, setShowBrush] = useState(false);

  const [keys, setKeys] = useState({
    ctrl: false,
    z: false,
    y: false,
  });

  const [width, height] = useMemo(() => [300, 300], []);
  const canvasRef = useRef(null);
  const [canvasCTX, setCanvasCTX] = useState(null);

  const startDrawing = (event) => {
    const localX = isMobile
      ? Math.floor(event.touches[0].clientX - whiteboardRef.current.offsetLeft)
      : Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = isMobile
      ? Math.floor(event.touches[0].clientY - whiteboardRef.current.offsetTop)
      : Math.floor(event.clientY - whiteboardRef.current.offsetTop);
    setMouseData({
      x: localX,
      y: localY,
    });

    setIsDrawing(true);
    setRedoHistory([]);
    setDrawHistory((prevHistory) => [
      ...prevHistory,
      {
        color: tool === BRUSH ? primary : secondary,
        size: size,
        tool: tool,
        points: [{ x: localX, y: localY }],
      },
    ]);

    updateColorHistory();
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    setRedraw(true);
  };

  const draw = (event) => {
    const localX = isMobile
      ? Math.floor(event.touches[0].clientX - whiteboardRef.current.offsetLeft)
      : Math.floor(event.clientX - whiteboardRef.current.offsetLeft);
    const localY = isMobile
      ? Math.floor(event.touches[0].clientY - whiteboardRef.current.offsetTop)
      : Math.floor(event.clientY - whiteboardRef.current.offsetTop);
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
    if (ctx && stroke && stroke.points.length > 0) {
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
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      for (const stroke of drawHistory) {
        drawStroke(ctx, stroke);
      }
      setRedraw(false);
      localStorage.setItem("drawHistory", JSON.stringify(drawHistory));
    }
  }, [canvasCTX, drawHistory, setRedraw, drawStroke]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCanvasCTX(ctx);
  }, [canvasRef, width, height]);

  useEffect(() => {
    let animationFrameId;
    const ctx = canvasCTX;
    if (redraw) {
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
  }, [canvasCTX, drawHistory, redraw, drawStroke, redrawCanvas]);

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

  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="Canvas">
      <div
        className="Whiteboard"
        style={{ width: width, height: height }}
        ref={whiteboardRef}
        onMouseEnter={(event) => {
          if (!isMobile) {
            event.preventDefault();
            setShowBrush(true);
          }
        }}
        onMouseDown={(event) => {
          if (!isMobile) {
            event.preventDefault();
            startDrawing(event);
          }
        }}
        onMouseMove={(event) => {
          if (!isMobile) {
            event.preventDefault();
            draw(event);
          }
        }}
        onMouseUp={(event) => {
          if (!isMobile) {
            event.preventDefault();
            finishDrawing();
          }
        }}
        onMouseLeave={(event) => {
          if (!isMobile) {
            event.preventDefault();
            setShowBrush(false);
            finishDrawing();
          }
        }}
        onTouchStart={(event) => {
          if (isMobile) {
            setShowBrush(true);
            startDrawing(event);
          }
        }}
        onTouchMove={(event) => {
          if (isMobile) draw(event);
        }}
        onTouchEnd={(event) => {
          if (isMobile) {
            finishDrawing();
            setShowBrush(false);
          }
        }}
      >
        <canvas className="Minicanvas" ref={canvasRef} />
        <div
          className="Paintbrush"
          style={
            showBrush && !isDrawing
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
      <h1 className="Footer">
        Draw the word! Complex drawings have trouble submitting!
      </h1>
    </div>
  );
}

export default Canvas;
