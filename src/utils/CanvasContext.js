import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import Categories from "../assets/categories.txt"; // Words from Quick, Draw!

const PrimaryContext = createContext();
export function usePrimary() {
  return useContext(PrimaryContext);
}

const PrimaryUpdateContext = createContext();
export function usePrimaryUpdate() {
  return useContext(PrimaryUpdateContext);
}

const SecondaryContext = createContext();
export function useSecondary() {
  return useContext(SecondaryContext);
}

const SecondaryUpdateContext = createContext();
export function useSecondaryUpdate() {
  return useContext(SecondaryUpdateContext);
}

const SizeContext = createContext();
export function useSize() {
  return useContext(SizeContext);
}

const SizeUpdateContext = createContext();
export function useSizeUpdate() {
  return useContext(SizeUpdateContext);
}
const DrawHistoryContext = createContext();
export function useDrawHistory() {
  return useContext(DrawHistoryContext);
}

const DrawHistoryUpdateContext = createContext();
export function useDrawHistoryUpdate() {
  return useContext(DrawHistoryUpdateContext);
}

const RedoHistoryContext = createContext();
export function useRedoHistory() {
  return useContext(RedoHistoryContext);
}

const RedoHistoryUpdateContext = createContext();
export function useRedoHistoryUpdate() {
  return useContext(RedoHistoryUpdateContext);
}

const HandleUndoContext = createContext();
export function useHandleUndo() {
  return useContext(HandleUndoContext);
}

const HandleRedoContext = createContext();
export function useHandleRedo() {
  return useContext(HandleRedoContext);
}

const HandleClearContext = createContext();
export function useHandleClear() {
  return useContext(HandleClearContext);
}

const ToolContext = createContext();
export function useTool() {
  return useContext(ToolContext);
}

const BrushToolContext = createContext();
export function useBrushTool() {
  return useContext(BrushToolContext);
}

const EraserToolContext = createContext();
export function useEraserTool() {
  return useContext(EraserToolContext);
}

const RedrawContext = createContext();
export function useRedraw() {
  return useContext(RedrawContext);
}

const RedrawUpdateContext = createContext();
export function useRedrawUpdate() {
  return useContext(RedrawUpdateContext);
}

const WordContext = createContext();
export function useWord() {
  return useContext(WordContext);
}

const ColorHistoryContext = createContext();
export function useColorHistory() {
  return useContext(ColorHistoryContext);
}

const UpdateColorHistoryContext = createContext();
export function useUpdateColorHistory() {
  return useContext(UpdateColorHistoryContext);
}

export function CanvasProvider({ children }) {
  const [primary, setPrimary] = useState("#000000");
  const [secondary, setSecondary] = useState("#FFFFFF");
  const [size, setSize] = useState(5);
  const [drawHistory, setDrawHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [BRUSH, ERASER] = [0, 1];
  const [tool, setTool] = useState(BRUSH);
  const [redraw, setRedraw] = useState(false);
  const [word, setWord] = useState("");

  const [colorHistory, setColorHistory] = useState([
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
  ]);

  useEffect(() => {
    fetch(Categories)
      .then((res) => res.text())
      .then((text) => {
        const list = text.split("\r\n");
        setWord(list[Math.floor(Math.random() * list.length)].toUpperCase());
      });
  }, []);

  const handleUndo = useCallback(() => {
    if (drawHistory.length > 0) {
      setRedoHistory((prevHistory) => {
        return [...prevHistory, drawHistory[drawHistory.length - 1]];
      });
      setDrawHistory((prevHistory) => prevHistory.slice(0, -1));
      setRedraw(true);
    }
  }, [drawHistory]);

  const handleRedo = useCallback(() => {
    if (redoHistory.length > 0) {
      setDrawHistory((prevHistory) => [
        ...prevHistory,
        redoHistory[redoHistory.length - 1],
      ]);
      setRedoHistory((prevHistory) => prevHistory.slice(0, -1));
    }
  }, [redoHistory]);

  const handleClear = useCallback(() => {
    setDrawHistory([]);
    setRedoHistory([]);
    setRedraw(true);
  }, []);

  const updateColorHistory = useCallback(() => {
    let newColorHistory = [...colorHistory];
    if (tool === BRUSH && !newColorHistory.includes(primary)) {
      newColorHistory.unshift(primary);
      newColorHistory.pop();
      setColorHistory(newColorHistory);
    } else if (tool === ERASER && !newColorHistory.includes(secondary)) {
      newColorHistory.unshift(secondary);
      newColorHistory.pop();
      setColorHistory(newColorHistory);
    }
  }, [colorHistory, BRUSH, ERASER, tool, primary, secondary]);

  const setBrush = useCallback(() => setTool(BRUSH), [BRUSH]);
  const setEraser = useCallback(() => setTool(ERASER), [ERASER]);

  return (
    <PrimaryContext.Provider value={primary}>
      <PrimaryUpdateContext.Provider value={setPrimary}>
        <SecondaryContext.Provider value={secondary}>
          <SecondaryUpdateContext.Provider value={setSecondary}>
            <SizeContext.Provider value={size}>
              <SizeUpdateContext.Provider value={setSize}>
                <DrawHistoryContext.Provider value={drawHistory}>
                  <DrawHistoryUpdateContext.Provider value={setDrawHistory}>
                    <RedoHistoryContext.Provider value={redoHistory}>
                      <RedoHistoryUpdateContext.Provider value={setRedoHistory}>
                        <HandleUndoContext.Provider value={handleUndo}>
                          <HandleRedoContext.Provider value={handleRedo}>
                            <HandleClearContext.Provider value={handleClear}>
                              <ToolContext.Provider value={tool}>
                                <BrushToolContext.Provider value={setBrush}>
                                  <EraserToolContext.Provider value={setEraser}>
                                    <RedrawContext.Provider value={redraw}>
                                      <RedrawUpdateContext.Provider
                                        value={setRedraw}
                                      >
                                        <WordContext.Provider value={word}>
                                          <ColorHistoryContext.Provider
                                            value={colorHistory}
                                          >
                                            <UpdateColorHistoryContext.Provider
                                              value={updateColorHistory}
                                            >
                                              {children}
                                            </UpdateColorHistoryContext.Provider>
                                          </ColorHistoryContext.Provider>
                                        </WordContext.Provider>
                                      </RedrawUpdateContext.Provider>
                                    </RedrawContext.Provider>
                                  </EraserToolContext.Provider>
                                </BrushToolContext.Provider>
                              </ToolContext.Provider>
                            </HandleClearContext.Provider>
                          </HandleRedoContext.Provider>
                        </HandleUndoContext.Provider>
                      </RedoHistoryUpdateContext.Provider>
                    </RedoHistoryContext.Provider>
                  </DrawHistoryUpdateContext.Provider>
                </DrawHistoryContext.Provider>
              </SizeUpdateContext.Provider>
            </SizeContext.Provider>
          </SecondaryUpdateContext.Provider>
        </SecondaryContext.Provider>
      </PrimaryUpdateContext.Provider>
    </PrimaryContext.Provider>
  );
}
