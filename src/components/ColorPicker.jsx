import PropTypes from "prop-types";
import { SliderPicker } from "react-color";

const ColorPicker = ({ label, color, onChange, isOpen, onToggle }) => {
  return (
    <div className="color-picker">
      <h4 onClick={onToggle} style={{ cursor: "pointer" }}>
        {label}
      </h4>
      {isOpen && (
        <SliderPicker
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
