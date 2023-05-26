import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import { useWord } from "../../utils/CanvasContext";
import Header from "../Header";
import Home from "../Home";
import Gallery from "../Gallery";
import { usePing } from "../../utils/usePing";
import { deleteAllWords } from "../../utils/Word";
import { deleteAllDrawings } from "../../utils/Drawing";

function App() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();
  const ping = usePing();

  return ping ? (
    <div className="App">
      <Header />
      {isMobile ? (
        isPortrait ? (
          <h1 className="Word">{word}</h1>
        ) : (
          <div />
        )
      ) : (
        <h1 className="Word">{word}</h1>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
      </Routes>
    </div>
  ) : (
    <div />
  );
}

export default App;
