import "./Home.css";
import Canvas from "../Canvas";
import Controls from "../Controls";
import { usePortrait } from "../../utils/usePortrait";
import { useMobile } from "../../utils/useMobile";
import { useWord } from "../../utils/DrawdleContext";

function Home() {
  const isMobile = useMobile();
  const isPortrait = usePortrait();
  const word = useWord();

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
