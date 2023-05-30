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
  const currentDay = new Date(currentTime.toDateString());

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
