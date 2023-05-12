import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Drawing.css";

function Drawing({ drawing, drawingWidth, drawingHeight }) {
  const offscreenRef = useRef(null);
  const [offscreenCanvasCTX, setOffscreenCanvasCTX] = useState(null);
  const canvasRef = useRef(null);
  const [canvasCTX, setCanvasCTX] = useState(null);
  const [width, height] = useMemo(() => [300, 300], []);

  const drawResizedImage = useCallback(
    (canvas, offscreenCanvas) => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = offscreenCanvas.width;
      const imageHeight = offscreenCanvas.height;

      // Determine the aspect ratio of the image
      const aspectRatio = imageWidth / imageHeight;

      // Calculate the maximum width and height of the resized image based on the maximum width and height of the canvas, and the aspect ratio of the image.
      let maxWidth = canvasWidth;
      let maxHeight = canvasHeight;
      if (aspectRatio > 1) {
        maxHeight = canvasWidth / aspectRatio;
      } else {
        maxWidth = canvasHeight * aspectRatio;
      }

      // Determine the x and y offsets for centering the image on the canvas.
      const xOffset = (canvasWidth - maxWidth) / 2;
      const yOffset = (canvasHeight - maxHeight) / 2;

      // Draw the image on the canvas using the drawImage() method
      const ctx = canvasCTX;
      ctx.drawImage(offscreenCanvas, xOffset, yOffset, maxWidth, maxHeight);
    },
    [canvasCTX]
  );

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
    const offscreenCtx = offscreenCanvasCTX;
    if (offscreenCtx) {
      offscreenCtx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      offscreenCtx.fillStyle = "#FFFFFF";
      offscreenCtx.fillRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      for (const stroke of drawing) {
        drawStroke(offscreenCtx, stroke);
      }
      drawResizedImage(canvasRef.current, offscreenRef.current);
    }
  }, [offscreenCanvasCTX, offscreenRef, drawing, drawStroke, drawResizedImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });
    canvas.width = drawingWidth;
    canvas.height = drawingHeight;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setCanvasCTX(ctx);

    const offscreen = offscreenRef.current;
    const offscreenCtx = offscreen.getContext("2d", {
      alpha: false,
      willReadFrequently: true,
    });
    offscreen.width = width;
    offscreen.height = height;
    offscreenCtx.clearRect(
      0,
      0,
      offscreenRef.current.width,
      offscreenRef.current.height
    );
    offscreenCtx.fillStyle = "#FFFFFF";
    offscreenCtx.fillRect(
      0,
      0,
      offscreenRef.current.width,
      offscreenRef.current.height
    );
    setOffscreenCanvasCTX(offscreenCtx);
  }, [canvasRef, offscreenRef, width, height, drawingWidth, drawingHeight]);

  useEffect(() => {
    let animationFrameId = requestAnimationFrame(redrawCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [redrawCanvas]);

  return (
    <div
      className="Drawing"
      style={{ width: `${drawingWidth}px`, height: `${drawingHeight}px` }}
    >
      <canvas className="DrawingCanvas" ref={canvasRef} />
      <canvas className="OffscreenCanvas" ref={offscreenRef} hidden />
    </div>
  );
}

export default Drawing;
