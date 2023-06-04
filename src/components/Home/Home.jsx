import "./Home.css";
import Canvas from "../Canvas";
import Controls from "../Controls";
import { usePortrait } from "../../utils/usePortrait";
import { useMobile } from "../../utils/useMobile";
import { useDrawing, useWord } from "../../utils/DrawdleContext";
import { useEffect } from "react";

function Home() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();
  const drawings = useDrawing();

  useEffect(() => {
    if (Object.keys(drawings).length === 0) {
      alert("Draw the daily word! Keep it simple!");
    }
  });

  return (
    <div className="Home">
      {isMobile ? (
        isPortrait ? (
          <h1 className="Word" style={{ top: "-0.15rem" }}>
            {word}
          </h1>
        ) : (
          <div />
        )
      ) : (
        <h1 className="Word" style={{ top: "-0.15rem" }}>
          {word}
        </h1>
      )}
      <div
        className="CanvasContainer"
        style={
          isPortrait ? { flexDirection: "column" } : { flexDirection: "row" }
        }
      >
        <Canvas />
        <Controls />
      </div>
    </div>
  );
}

export default Home;
