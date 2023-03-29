import "./App.css";
import Canvas from "../Canvas";
import { Routes, Route } from "react-router-dom";
import Header from "../Header/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <h1>Prompt</h1>
      <Routes>
        <Route path="/" element={<Canvas />} />
      </Routes>
    </div>
  );
}

export default App;

