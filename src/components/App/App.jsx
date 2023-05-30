import "./App.css";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import { useDrawing, useWord } from "../../utils/CanvasContext";
import Header from "../Header";
import Home from "../Home";
import Gallery from "../Gallery";
import { usePing } from "../../utils/usePing";
import { useRef } from "react";
// import { deleteAllWords } from "../../utils/Word";
// import { deleteAllDrawings } from "../../utils/Drawing";

function App() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const ping = usePing();
  const word = useWord();
  const drawings = useDrawing();

  const currentTime = new Date();
  const currentDay = new Date(currentTime.toDateString());

  const appRef = useRef();

  // deleteAllWords();
  // deleteAllDrawings();

  return ping ? (
    <div className="App" ref={appRef}>
      <Header />
      {isMobile ? (
        isPortrait ? (
          <h1 className="Word" style={{ top: "2.75rem" }}>
            {word}
          </h1>
        ) : (
          <div />
        )
      ) : (
        <h1 className="Word" style={{ top: "2.75rem" }}>
          {word}
        </h1>
      )}
      {drawings[currentDay] ? <Gallery appRef={appRef} /> : <Home />}
    </div>
  ) : (
    <div />
  );
}

export default App;
