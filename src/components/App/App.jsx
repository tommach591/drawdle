import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "../Header";
import Home from "../Home";
import { getWord, getDictionary } from "../../utils/Prompt";
import { useEffect, useState } from "react";

function App() {
  const [word, setWord] = useState("");
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    getWord().then((res) => {
      setWord(res[0]);
      getDictionary(res[0]).then((res) => {
        res[0].meanings[0].definitions.sort((a, b) => a.length - b.length);
        setPrompt(res[0].meanings[0].definitions[0].definition);
      });
    });
  }, []);

  useEffect(() => {
    console.log(word, prompt);
  }, [word, prompt]);

  return (
    <div className="App">
      <Header />
      <h1>{prompt}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
