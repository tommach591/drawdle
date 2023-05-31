import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getWord, postDaily } from "./Word";

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

const DrawingContext = createContext();
export function useDrawing() {
  return useContext(DrawingContext);
}

const UpdateDrawingContext = createContext();
export function useUpdateDrawing() {
  return useContext(UpdateDrawingContext);
}

const LikesContext = createContext();
export function useLikes() {
  return useContext(LikesContext);
}

const UpdateLikesContext = createContext();
export function useUpdateLikes() {
  return useContext(UpdateLikesContext);
}

const TodayContext = createContext();
export function useToday() {
  return useContext(TodayContext);
}

const SkipDaysContext = createContext();
export function useSkipDays() {
  return useContext(SkipDaysContext);
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
  const [today, setToday] = useState(new Date());
  const [word, setWord] = useState("");

  const [drawings, setDrawings] = useState({});
  const [likes, setLikes] = useState(new Set());

  const [colorHistory, setColorHistory] = useState([
    "#000000",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
    "#ffffff",
  ]);

  useEffect(() => {
    // localStorage.clear();
    let storedDrawings = JSON.parse(localStorage.getItem("drawings"));
    let storedLikes = JSON.parse(localStorage.getItem("likes"));
    if (!storedDrawings) storedDrawings = {};
    if (!storedLikes) storedLikes = [];

    setDrawings(storedDrawings);
    setLikes(new Set(storedLikes));

    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    nextDay.setHours(0, 0, 0, 0);

    getWord(today).then((res) => {
      if (res) {
        setWord(res.word);
      } else {
        postDaily().then((res) => {
          console.log(res.word);
          setWord(res.word);
        });
      }
    });

    const interval = setInterval(() => {
      alert("New day, new drawdle!");
      postDaily().then((res) => {
        setWord(res.word);
        setToday(new Date());
      });
    }, nextDay - today);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skipDays = useCallback(
    (change) => {
      const newDay = new Date(today);
      newDay.setDate(newDay.getDate() + change);
      newDay.setHours(0, 0, 0, 0);

      getWord(newDay).then((res) => {
        if (res) {
          setWord(res.word);
          setToday(newDay);
        } else {
          alert("You have reached the end :(");
        }
      });
    },
    [today]
  );

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

  const addDrawing = useCallback(
    (drawing_id) => {
      const newDrawings = JSON.parse(JSON.stringify(drawings));
      const currentTime = new Date();
      const currentDay = new Date(currentTime.toDateString());

      newDrawings[currentDay] = drawing_id;
      setDrawings(newDrawings);
      localStorage.setItem("drawings", JSON.stringify(newDrawings));
    },
    [drawings]
  );

  const updateLikes = useCallback(
    (drawing_id) => {
      const newLikes = new Set(likes);

      if (newLikes.has(drawing_id)) newLikes.delete(drawing_id);
      else newLikes.add(drawing_id);

      setLikes(newLikes);
      localStorage.setItem("likes", JSON.stringify(Array.from(newLikes)));
    },
    [likes]
  );

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
                                              <DrawingContext.Provider
                                                value={drawings}
                                              >
                                                <UpdateDrawingContext.Provider
                                                  value={addDrawing}
                                                >
                                                  <LikesContext.Provider
                                                    value={likes}
                                                  >
                                                    <UpdateLikesContext.Provider
                                                      value={updateLikes}
                                                    >
                                                      <TodayContext.Provider
                                                        value={today}
                                                      >
                                                        <SkipDaysContext.Provider
                                                          value={skipDays}
                                                        >
                                                          {children}
                                                        </SkipDaysContext.Provider>
                                                      </TodayContext.Provider>
                                                    </UpdateLikesContext.Provider>
                                                  </LikesContext.Provider>
                                                </UpdateDrawingContext.Provider>
                                              </DrawingContext.Provider>
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
