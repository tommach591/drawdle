import "./Home.css";
import Canvas from "../Canvas";
import Controls from "../Controls";
import { usePortrait } from "../../utils/usePortrait";

function Home() {
  const isPortrait = usePortrait();
  return (
    <div
      className="Home"
      style={
        isPortrait ? { flexDirection: "column" } : { flexDirection: "row" }
      }
    >
      <Canvas />
      <Controls />
    </div>
  );
}

export default Home;
