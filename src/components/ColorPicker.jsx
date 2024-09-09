import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

const ColorPicker = ({ label, color, onChange, isOpen, onToggle }) => {
  return (
    <div className="color-picker">
      <div
        className="flex flex-row"
        onClick={onToggle}
        style={{ cursor: "pointer" }}
      >
        <h4 className="dark:text-slate-50">{label}</h4>
        <div className="my-auto mx-2 ">
          {!isOpen ? (
            <ChevronDown size={18} strokeWidth={1} color="#f5f5f5" />
          ) : (
            <ChevronUp size={18} strokeWidth={1} color="#f5f5f5" />
          )}
        </div>
        <div className="my-auto mx-2 dark:hidden">
          {!isOpen ? (
            <ChevronDown size={18} strokeWidth={1} />
          ) : (
            <ChevronUp size={18} strokeWidth={1} />
          )}
        </div>
      </div>
      {isOpen && (
        <SketchPicker
          color={color}
          onChangeComplete={(color) => onChange(color.hex)}
        />
      )}
    </div>
  );
};

ColorPicker.propTypes = {
  label: PropTypes.string.isRequired, // Label for the color picker
  color: PropTypes.string.isRequired, // Current color value
  onChange: PropTypes.func.isRequired, // Function to handle color changes
  isOpen: PropTypes.bool.isRequired, // Boolean to control visibility of the picker
  onToggle: PropTypes.func.isRequired, // Function to toggle the picker open/close
};

export default ColorPicker;
