import { useContext } from "react";
import DarkModeContext from "../context/DarkModeContext";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <button
      className="fixed bottom-4 right-4 p-1 sm:p-2 md:p-3 rounded-full dark:bg-[#555] bg-white  text-gray-900 dark:text-white shadow-lg"
      onClick={toggleDarkMode}
    >
      {isDarkMode ? <Sun /> : <Moon color="#77a536" />}
    </button>
  );
};

export default DarkModeToggle;
