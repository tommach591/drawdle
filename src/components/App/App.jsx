import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "../Header";
import Home from "../Home";
import { getWord } from "../../utils/Prompt";
import { useEffect, useState } from "react";

function App() {
  const [word, setWord] = useState("");

  useEffect(() => {
    getWord().then((res) => {
      setWord(res[0]);
    });
  }, []);

  return (
    <div className="App">
      <Header />
      <h1>{word}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
