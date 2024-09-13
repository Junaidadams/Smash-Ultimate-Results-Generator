import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { bgList, characterList } from "../../constants";
import ColorPicker from "./ColorPicker";

const Top8Display = ({ eventName, date, playerData, tournamentName }) => {
  const displayRef = useRef(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(
    bgList[0].Black[0]
  );
  const [customizationOptions, setCustomizationOptions] = useState({
    textColor: "#f5f5f5",
    tileBorderColor: "#f5f5f5",
    tileBGColor: "#f5f5f5",
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

  const findImage = (characterKey, skinKey) => {
    // Find the character by key (make sure the key is matched properly)
    const characterDetails = characterList.find(
      (character) => character.key === Number(characterKey)
    );

    if (!characterDetails) {
      // Handle case when character is not found
      return null;
    }

    // Access the first image object in images array and then the displayImages array
    const displayImage =
      characterDetails?.images?.[0]?.displayImages?.[skinKey] ||
      characterDetails?.images?.[0]?.displayImages?.[0]; // Fallback to default image if skinKey not found

    return displayImage || null; // Return null if no image is found
  };

  const togglePicker = (pickerName) => {
    setOpenPicker((prevOpenPicker) =>
      prevOpenPicker === pickerName ? null : pickerName
    );
  };

  if (!playerData) return null;

  const player1 = playerData.player1;
  const player2 = playerData.player2;
  const player3 = playerData.player3;
  const player4 = playerData.player4;
  const player5 = playerData.player5;
  const player6 = playerData.player6;
  const player7 = playerData.player7;
  const player8 = playerData.player8;

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
        className={`fixed top-0 left-0 w-[1920px] h-[1080px] p-8 -z-10 flex flex-col`}
        style={{
          backgroundImage: `url(${selectedBackground})`,
          backgroundSize: "cover",
          color: customizationOptions.textColor,
        }}
      >
        <div className="flex items-center mb-4 max-h-full">
          <div>
            <h2 className="text-5xl mr-6 font-semibold capitalize">
              {tournamentName}
            </h2>
            <h2 className="text-4xl font-semibold mr-auto">{eventName}</h2>
          </div>
          <p className="text-4xl ml-auto">{date}</p>
        </div>

        <div className="bg-white w-full h-2/3 m-auto p-4 flex flex-row space-x-4 ">
          {/* FIRST PLACE DIV */}
          <div className="flex w-[35%] h-full bg-blue-500 flex-col">
            <div className="ml-auto">
              <h1 className="ml-auto font-semibold text-5xl mt-3 mr-4">
                {playerData.player1.placement}
              </h1>
            </div>
            <div>
              <img
                src={findImage(player1.character, player1.skin)}
                alt={
                  characterList.find(
                    (character) => character.key === Number(player1.character)
                  )?.name || "Character"
                }
                className=" object-cover m-auto"
              />
            </div>
            <div className="mx-auto">
              <h1 className=" font-semibold text-5xl mt-3 mr-4">
                {player1.prefix ? `${player1.prefix} |` : ""} {player1.name}
              </h1>
            </div>
          </div>
          {/* END OF PLACE DIV */}
          <div className="flex flex-col w-[65%] space-y-4">
            <div className="flex flex-row justify-between space-x-4 w-full h-[55%]">
              {/* START OF 2ND PLACE DIV */}
              <div className="w-1/3 h-full bg-red-300 flex flex-col justify-between items-center">
                <div className="ml-auto">
                  <h1 className="ml-auto font-bold text-4xl mt-3 mr-4">
                    {playerData.player2.placement}
                  </h1>
                </div>
                <div className="flex justify-center items-center h-[60%] overflow-hidden">
                  <img
                    src={findImage(player2.character, player2.skin)}
                    alt={
                      characterList.find(
                        (character) =>
                          character.key === Number(player2.character)
                      )?.name || "Character"
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mx-auto">
                  <h1 className="font-semibold text-4xl my-3 mr-4 text-center">
                    {player2.prefix ? `${player2.prefix} |` : ""} {player2.name}
                  </h1>
                </div>
              </div>
              {/* END OF 2ND PLACE DIV */}
              {/* START OF 3RD PLACE DIV */}
              <div className="w-1/3 h-full bg-red-300 flex flex-col justify-between items-center">
                <div className="ml-auto">
                  <h1 className="ml-auto font-bold text-4xl mt-3 mr-4">
                    {playerData.player3.placement}
                  </h1>
                </div>
                <div className="flex justify-center items-center h-[60%] overflow-hidden">
                  <img
                    src={findImage(player3.character, player3.skin)}
                    alt={
                      characterList.find(
                        (character) =>
                          character.key === Number(player3.character)
                      )?.name || "Character"
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mx-auto">
                  <h1 className="font-semibold text-4xl my-3 mr-4 text-center">
                    {player3.prefix ? `${player3.prefix} |` : ""} {player3.name}
                  </h1>
                </div>
              </div>{" "}
              {/* END OF 3RD PLACE DIV */}
              {/* START OF 3RD PLACE DIV */}
              <div className="w-1/3 h-full bg-red-300 flex flex-col justify-between items-center">
                <div className="ml-auto">
                  <h1 className="ml-auto font-bold text-4xl mt-3 mr-4">
                    {playerData.player4.placement}
                  </h1>
                </div>
                <div className="flex justify-center items-center h-[60%] overflow-hidden">
                  <img
                    src={findImage(player4.character, player4.skin)}
                    alt={
                      characterList.find(
                        (character) =>
                          character.key === Number(player4.character)
                      )?.name || "Character"
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mx-auto">
                  <h1 className="font-semibold text-4xl my-3 mr-4 text-center">
                    {player4.prefix ? `${player4.prefix} |` : ""} {player4.name}
                  </h1>
                </div>
              </div>
              {/* END OF 4TH PLACE DIV */}
            </div>
            <div className="flex flex-row justify-between space-x-4 w-full h-[42%]">
              <div className="w-1/4 h-full bg-red-300 flex flex-col justify-between items-center">
                <div className="ml-auto">
                  <h1 className="ml-auto font-bold text-4xl mt-3 mr-4">
                    {playerData.player4.placement}
                  </h1>
                </div>
                <div className="flex justify-center items-center h-[60%] overflow-hidden">
                  <img
                    src={findImage(player4.character, player4.skin)}
                    alt={
                      characterList.find(
                        (character) =>
                          character.key === Number(player4.character)
                      )?.name || "Character"
                    }
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mx-auto">
                  <h1 className="font-semibold text-4xl my-3 mr-4 text-center">
                    {player4.prefix ? `${player4.prefix} |` : ""} {player4.name}
                  </h1>
                </div>
              </div>
              <div className="w-1/4">Content 6</div>
              <div className="w-1/4">Content 7</div>
              <div className="w-1/4">Content 8</div>
            </div>
          </div>
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
