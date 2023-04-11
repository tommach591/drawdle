import { useContext, createContext, useState, useCallback } from "react";

const ColorContext = createContext();
export function useColor() {
  return useContext(ColorContext);
}

const ColorUpdateContext = createContext();
export function useColorUpdate() {
  return useContext(ColorUpdateContext);
}

const BackgroundContext = createContext();
export function useBackground() {
  return useContext(BackgroundContext);
}

const BackgroundUpdateContext = createContext();
export function useBackgroundUpdate() {
  return useContext(BackgroundUpdateContext);
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

const StrokeCountContext = createContext();
export function useStrokeCount() {
  return useContext(StrokeCountContext);
}

const StrokeCountUpdateContext = createContext();
export function useStrokeCountUpdate() {
  return useContext(StrokeCountUpdateContext);
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

export function CanvasProvider({ children }) {
  const [color, setColor] = useState("#000000");
  const [background, setBackground] = useState("#FFFFFF");
  const [size, setSize] = useState(5);
  const [drawHistory, setDrawHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [strokeCount, setStrokeCount] = useState(0);

  const handleUndo = useCallback(() => {
    if (drawHistory.length > 0) {
      setRedoHistory((prevHistory) => {
        return [...prevHistory, drawHistory[drawHistory.length - 1]];
      });
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

  const handleClear = useCallback(() => {
    setDrawHistory([]);
    setRedoHistory([]);
  }, []);

  return (
    <ColorContext.Provider value={color}>
      <ColorUpdateContext.Provider value={setColor}>
        <BackgroundContext.Provider value={background}>
          <BackgroundUpdateContext.Provider value={setBackground}>
            <SizeContext.Provider value={size}>
              <SizeUpdateContext.Provider value={setSize}>
                <DrawHistoryContext.Provider value={drawHistory}>
                  <DrawHistoryUpdateContext.Provider value={setDrawHistory}>
                    <RedoHistoryContext.Provider value={redoHistory}>
                      <RedoHistoryUpdateContext.Provider value={setRedoHistory}>
                        <StrokeCountContext.Provider value={strokeCount}>
                          <StrokeCountUpdateContext.Provider
                            value={setStrokeCount}
                          >
                            <HandleUndoContext.Provider value={handleUndo}>
                              <HandleRedoContext.Provider value={handleRedo}>
                                <HandleClearContext.Provider
                                  value={handleClear}
                                >
                                  {children}
                                </HandleClearContext.Provider>
                              </HandleRedoContext.Provider>
                            </HandleUndoContext.Provider>
                          </StrokeCountUpdateContext.Provider>
                        </StrokeCountContext.Provider>
                      </RedoHistoryUpdateContext.Provider>
                    </RedoHistoryContext.Provider>
                  </DrawHistoryUpdateContext.Provider>
                </DrawHistoryContext.Provider>
              </SizeUpdateContext.Provider>
            </SizeContext.Provider>
          </BackgroundUpdateContext.Provider>
        </BackgroundContext.Provider>
      </ColorUpdateContext.Provider>
    </ColorContext.Provider>
  );
}
