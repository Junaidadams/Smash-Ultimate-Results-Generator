import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toPng } from "html-to-image";
import { characterList, bgList } from "../../constants";

const Top8Display = ({ eventName, date, playerData }) => {
  const displayRef = useRef(null);
  const [pngDataUrl, setPngDataUrl] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState(
    bgList[0].Black[0]
  );

  useEffect(() => {
    if (displayRef.current && playerData) {
      console.log("displayRef is populated", displayRef.current);
      console.log("playerData", playerData);
      console.log(pngDataUrl);

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
  }, [playerData]);

  if (!playerData) return null;

  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Dropdown for selecting background */}
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

      <div
        ref={displayRef}
        className={`fixed top-0 left-0 w-[1920px] h-[1080px] p-8 -z-10`}
        style={{
          backgroundImage: `url(${selectedBackground})`,
          backgroundSize: "cover",
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{eventName}</h2>
          <p className="text-lg">{date}</p>
        </div>

        <div className="grid grid-cols-4 gap-4 h-full">
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
                className="flex flex-col items-center border-2 border-red-500 rounded-xl p-4"
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
                  {player.prefix} | {player.name}
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

export default Top8Display;

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
};
