import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { characterList, bgList } from "../../constants";
import ColorPicker from "./ColorPicker";

const Top8Display = ({ eventName, date, playerData, tournamentName }) => {
  const displayRef = useRef(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(
    bgList[0].Black[0]
  );
  const [customizationOptions, setCustomizationOptions] = useState({
    textColor: "#f5f5f5",
    tileBorderColor: "#FFFFFF",
    tileBGColor: "#FFFFFF",
  });

  // State to track which color picker is open
  const [openPicker, setOpenPicker] = useState(null);

  useEffect(() => {
    if (displayRef.current && playerData) {
      const timeoutId = setTimeout(() => {
        toPng(displayRef.current, { pixelRatio: 1 })
          .then((dataUrl) => {
            setPngDataUrl(dataUrl);
          })
          .catch((err) => {
            console.error("Failed to capture the component as a PNG", err);
          });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [playerData, selectedBackground, customizationOptions]);

  const handleColorChange = (key, color) => {
    setCustomizationOptions((prevOptions) => ({
      ...prevOptions,
      [key]: color,
    }));
  };

  const togglePicker = (pickerName) => {
    setOpenPicker((prevOpenPicker) =>
      prevOpenPicker === pickerName ? null : pickerName
    );
  };

  if (!playerData) return null;

  return (
    <div className="flex flex-col items-center w-full h-full">
      <select
        value={selectedBackground}
        onChange={(e) => setSelectedBackground(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      >
        {bgList[0].Black.map((bg, index) => (
          <option key={index} value={bg}>
            Background {index + 1}
          </option>
        ))}
      </select>

      {/* Color pickers for customization options */}
      <div className="flex space-x-4 mb-4">
        <ColorPicker
          label="Text Color"
          color={customizationOptions.textColor}
          isOpen={openPicker === "textColor"}
          onToggle={() => togglePicker("textColor")}
          onChange={(color) => handleColorChange("textColor", color)}
        />
        <ColorPicker
          label="Tile Border Color"
          color={customizationOptions.tileBorderColor}
          isOpen={openPicker === "tileBorderColor"}
          onToggle={() => togglePicker("tileBorderColor")}
          onChange={(color) => handleColorChange("tileBorderColor", color)}
        />
        <ColorPicker
          label="Tile Background Color"
          color={customizationOptions.tileBGColor}
          isOpen={openPicker === "tileBGColor"}
          onToggle={() => togglePicker("tileBGColor")}
          onChange={(color) => handleColorChange("tileBGColor", color)}
        />
      </div>

      <div
        ref={displayRef}
        className={`fixed top-0 left-0 w-[1920px] h-[1080px] p-8 -z-10 `}
        style={{
          backgroundImage: `url(${selectedBackground})`,
          backgroundSize: "cover",
          color: customizationOptions.textColor,
        }}
      >
        <div className="flex items-center mb-4 max-h-full">
          <h2 className="text-3xl mr-6 font-semibold capitalize">
            {tournamentName}
          </h2>
          <h2 className="text-2xl font-semibold mr-auto">{eventName}</h2>
          <p className="text-lg">{date}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 max-h-full">
          {Object.keys(playerData).map((playerKey) => {
            const player = playerData[playerKey];
            const characterDetails = characterList.find(
              (character) => character.key === Number(player.character)
            );
            const currentImage =
              characterDetails?.images[0].displayImages[player.skin] ||
              characterDetails?.images[0].displayImages[0];

            return (
              <div
                key={playerKey}
                className="flex flex-col items-center border-2 rounded-xl p-4"
                style={{
                  borderColor: customizationOptions.tileBorderColor,
                  backgroundColor: customizationOptions.tileBGColor,
                }}
              >
                <h1 className="text-4xl w-fit mr-auto font-semibold">
                  {player.placement}
                </h1>
                <img
                  src={currentImage}
                  alt={characterDetails?.name || "Character"}
                  className="w-72 h-72 object-cover mb-2"
                />
                <h3 className="text-3xl font-semibold">
                  {player.prefix
                    ? `${player.prefix} | ${player.name}`
                    : `${player.name}`}
                </h3>
                <p className="text-lg">{characterDetails?.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {pngDataUrl && (
        <img
          src={pngDataUrl}
          alt="Top 8 Display"
          className="w-full h-auto object-contain"
        />
      )}
    </div>
  );
};

Top8Display.propTypes = {
  eventName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  playerData: PropTypes.objectOf(
    PropTypes.shape({
      character: PropTypes.number.isRequired,
      skin: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      prefix: PropTypes.string.isRequired,
      placement: PropTypes.string.isRequired,
    })
  ).isRequired,
  tournamentName: PropTypes.string.isRequired,
};

export default Top8Display;
