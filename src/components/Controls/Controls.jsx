import {
  useSecondary,
  useSecondaryUpdate,
  useBrushTool,
  useBucketTool,
  usePrimary,
  usePrimaryUpdate,
  useEraserTool,
  useHandleClear,
  useHandleRedo,
  useHandleUndo,
  useSize,
  useSizeUpdate,
  useTool,
} from "../../utils/CanvasContext";
import "./Controls.css";

function Controls() {
  const defaultSize = [1, 3, 5, 10, 15, 25];
  const primary = usePrimary();
  const setPrimary = usePrimaryUpdate();
  const secondary = useSecondary();
  const setSecondary = useSecondaryUpdate();
  const size = useSize();
  const setSize = useSizeUpdate();
  const handleUndo = useHandleUndo();
  const handleRedo = useHandleRedo();
  const handleClear = useHandleClear();
  const tool = useTool();
  const setBrush = useBrushTool();
  const setEraser = useEraserTool();
  const setBucket = useBucketTool();
  const [BRUSH, ERASER, BUCKET] = [0, 1, 2];

  return (
    <div className="Controls">
      <div className="Size">
        <input
          className="Number"
          type="number"
          value={size}
          max={defaultSize[defaultSize.length - 1]}
          min={defaultSize[0]}
          onChange={(event) => {
            setSize(event.target.value > 50 ? 50 : event.target.value);
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
        <div
          className="Tool"
          style={tool === BUCKET ? { background: "rgb(190, 190, 190)" } : {}}
          onClick={() => {
            setBucket();
          }}
        >
          <img src="https://api.iconify.design/gg:color-bucket.svg" alt="" />
        </div>
      </div>
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
      <button className="BigButton">Submit</button>
    </div>
  );
}

export default Controls;
