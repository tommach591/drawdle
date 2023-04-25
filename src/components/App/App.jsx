import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "../Header";
import Home from "../Home";
import { useMobile } from "../../utils/useMobile";
import { usePortrait } from "../../utils/usePortrait";
import { useWord } from "../../utils/CanvasContext";

function App() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();

  return (
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
      </Routes>
    </div>
  );
}

export default App;
