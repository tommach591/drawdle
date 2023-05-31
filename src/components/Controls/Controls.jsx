import {
  useSecondary,
  useSecondaryUpdate,
  useBrushTool,
  usePrimary,
  usePrimaryUpdate,
  useEraserTool,
  useHandleClear,
  useHandleRedo,
  useHandleUndo,
  useSize,
  useSizeUpdate,
  useTool,
  useWord,
  useColorHistory,
  useDrawHistory,
  useUpdateDrawing,
} from "../../utils/DrawdleContext";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import "./Controls.css";
import { saveDrawing } from "../../utils/Drawing";

function Controls() {
  const defaultSize = [1, 5, 20];
  const primary = usePrimary();
  const setPrimary = usePrimaryUpdate();
  const secondary = useSecondary();
  const setSecondary = useSecondaryUpdate();
  const size = useSize();
  const setSize = useSizeUpdate();
  const handleUndo = useHandleUndo();
  const handleRedo = useHandleRedo();
  const handleClear = useHandleClear();
  const drawHistory = useDrawHistory();
  const tool = useTool();
  const setBrush = useBrushTool();
  const setEraser = useEraserTool();
  const [BRUSH, ERASER] = [0, 1];

  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();
  const colorHistory = useColorHistory();
  const addDrawing = useUpdateDrawing();

  return (
    <div
      className="Controls"
      style={
        isMobile && window.innerHeight >= 750
          ? { zoom: `${145}%` }
          : { zoom: `${100}%` }
      }
    >
      <div className="MainPanel">
        {isMobile ? (
          isPortrait ? (
            <div />
          ) : (
            <h1 className="Word">{word}</h1>
          )
        ) : (
          <div />
        )}
        <div className="History">
          <button
            onClick={() => {
              handleUndo();
            }}
          >
            <img src="https://api.iconify.design/ic:round-undo.svg" alt="" />
          </button>
          <button
            onClick={() => {
              handleRedo();
            }}
          >
            <img src="https://api.iconify.design/ic:round-redo.svg" alt="" />
          </button>
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
        <div className="Size">
          <input
            className="Number"
            type="number"
            value={size}
            max={defaultSize[defaultSize.length - 1]}
            min={defaultSize[0]}
            onChange={(event) => {
              setSize(
                event.target.value > defaultSize[defaultSize.length - 1]
                  ? defaultSize[defaultSize.length - 1]
                  : event.target.value
              );
            }}
          />
          <input
            className="Range"
            type="range"
            value={size}
            max={defaultSize[defaultSize.length - 1]}
            min={defaultSize[0]}
            step={1}
            onChange={(event) => {
              setSize(
                event.target.value > defaultSize[defaultSize.length - 1]
                  ? defaultSize[defaultSize.length - 1]
                  : event.target.value
              );
            }}
          />
        </div>
        <div className="ColorGrid">
          <input
            className="Color"
            type="color"
            value={primary}
            onChange={(event) => {
              setPrimary(event.target.value);
            }}
          />
          <input
            className="Color"
            type="color"
            value={secondary}
            onChange={(event) => {
              setSecondary(event.target.value);
            }}
          />
        </div>
        <div className="ToolGrid">
          <div
            className="Tool"
            style={tool === BRUSH ? { background: "rgb(190, 190, 190)" } : {}}
            onClick={() => {
              setBrush();
            }}
          >
            <img
              src="https://api.iconify.design/material-symbols:brush-outline.svg"
              alt=""
            />
          </div>
          <div
            className="Tool"
            style={tool === ERASER ? { background: "rgb(190, 190, 190)" } : {}}
            onClick={() => {
              setEraser();
            }}
          >
            <img src="https://api.iconify.design/mdi:eraser.svg" alt="" />
          </div>
        </div>
        <button
          className="BigButton"
          onClick={() => {
            const response = window.confirm(
              "This action cannot be undone, clear canvas?"
            );
            if (response) {
              handleClear();
            }
          }}
        >
          Clear
        </button>
        <button
          className="BigButton"
          onClick={() => {
            saveDrawing(drawHistory).then((res) => {
              addDrawing(res._id);
            });
            alert("Submitted!");
          }}
        >
          Submit
        </button>
      </div>
      <div className="SidePanel">
        <div className="ColorHistoryGrid">
          {colorHistory.map((c, i) => {
            return (
              <div
                className="ColorHistory"
                key={i}
                style={{ background: c }}
                onClick={() => {
                  if (tool === BRUSH) setPrimary(c);
                  else setSecondary(c);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Controls;
