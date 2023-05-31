import "./App.css";
import { useDrawing } from "../../utils/DrawdleContext";
import Header from "../Header";
import Home from "../Home";
import Gallery from "../Gallery";
import { usePing } from "../../utils/usePing";
// import { deleteAllWords } from "../../utils/Word";
// import { deleteAllDrawings } from "../../utils/Drawing";

function App() {
  const ping = usePing();
  const drawings = useDrawing();

  const currentTime = new Date();
  const PST = new Date(
    currentTime.toLocaleString("en-US", { timeZone: "America/Los_Angeles" })
  );
  const currentDay = `${PST.getFullYear()}${
    PST.getMonth() + 1
  }${PST.getDate()}`;

  // deleteAllWords();
  // deleteAllDrawings();

  return ping ? (
    <div className="App">
      <Header />
      {drawings[currentDay] ? <Gallery /> : <Home />}
    </div>
  ) : (
    <div />
  );
}

export default App;
