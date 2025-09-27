import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./components/Dashboard/Auth";
import Home from "./components/Dashboard/Home"; // create this component
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
