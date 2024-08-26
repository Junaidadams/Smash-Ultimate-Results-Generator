import "./index.css";
import { Routes, Route } from "react-router-dom";

import NoPageFound from "./pages/NoPageFound";
import Home from "./pages/Home";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<NoPageFound />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
