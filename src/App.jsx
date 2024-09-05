import "./index.css";
import { Routes, Route } from "react-router-dom";

import NoPageFound from "./pages/NoPageFound";
import Home from "./pages/Home";

import { DarkModeProvider } from "./context/DarkModeContext.jsx";
import DarkModeToggle from "./components/DarkModeToggle";

function App() {
  return (
    <DarkModeProvider>
      <Routes>
        <Route path="/*" element={<NoPageFound />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <DarkModeToggle />
    </DarkModeProvider>
  );
}

export default App;
