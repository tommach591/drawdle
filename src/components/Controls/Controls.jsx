import {
  useBackground,
  useBackgroundUpdate,
  useColor,
  useColorUpdate,
  useHandleClear,
  useHandleRedo,
  useHandleUndo,
  useSize,
  useSizeUpdate,
} from "../../utils/CanvasContext";
import "./Controls.css";

function Controls() {
  const defaultSize = [1, 3, 5, 10, 25, 50];
  const size = useSize();
  const setSize = useSizeUpdate();
  const color = useColor();
  const setColor = useColorUpdate();
  const background = useBackground();
  const setBackground = useBackgroundUpdate();
  const handleUndo = useHandleUndo();
  const handleRedo = useHandleRedo();
  const handleClear = useHandleClear();

  return (
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
      <h1>Color</h1>
      <input
        className="Color"
        type="color"
        value={color}
        onChange={(event) => {
          setColor(event.target.value);
        }}
      />
      <h1>Background</h1>
      <input
        className="Color"
        type="color"
        value={background}
        onChange={(event) => {
          setBackground(event.target.value);
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
            handleClear();
          }
        }}
      >
        Clear
      </button>
      <button>Submit</button>
    </div>
  );
}

export default Controls;
