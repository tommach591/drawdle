import "./App.css";
import { Routes, Route } from "react-router-dom";
import Header from "../Header";
import Home from "../Home";

function App() {
  return (
    <div className="App">
      <Header />
      <h1>Prompt</h1>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;

