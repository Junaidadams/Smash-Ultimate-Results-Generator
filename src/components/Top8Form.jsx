import { useState } from "react";
import { characterList } from "../../constants";
import PropTypes from "prop-types";

const Top8Form = ({ onSubmit }) => {
  const [eventName, setEventName] = useState("");

  const [date, setDate] = useState("");
  const [playerData, setPlayerData] = useState({
    player1: { character: 0, skin: 0, name: "", prefix: "", placement: "1st" },
    player2: { character: 0, skin: 0, name: "", prefix: "", placement: "2nd" },
    player3: { character: 0, skin: 0, name: "", prefix: "", placement: "3rd" },
    player4: { character: 0, skin: 0, name: "", prefix: "", placement: "4th" },
    player5: { character: 0, skin: 0, name: "", prefix: "", placement: "5th" },
    player6: { character: 0, skin: 0, name: "", prefix: "", placement: "6th" },
    player7: { character: 0, skin: 0, name: "", prefix: "", placement: "7th" },
    player8: { character: 0, skin: 0, name: "", prefix: "", placement: "8th" },
  });

  const handleAutofillTest = () => {
    setPlayerData({
      player1: {
        character: "12",
        skin: 0,
        name: "Jeff",
        prefix: "Naut",
        placement: "1st",
      },
      player2: {
        character: "13",
        skin: 0,
        name: "Jeff",
        prefix: "Naut",
        placement: "2nd",
      },
      player3: {
        character: "13",
        skin: 0,
        name: "Jeff",
        prefix: "Naut",
        placement: "3rd",
      },
      player4: {
        character: "18",
        skin: 0,
        name: "Jeff",
        prefix: "Naut",
        placement: "4th",
      },
      player5: {
        character: "16",
        skin: 0,
        name: "Jeff",
        prefix: "Naut",
        placement: "5th",
      },
      player6: {
        character: "15",
        skin: 0,
        name: "FFFF",
        prefix: "Naut",
        placement: "6th",
      },
      player7: {
        character: "16",
        skin: 0,
        name: "fdfd",
        prefix: "dsds",
        placement: "7th",
      },
      player8: {
        character: "15",
        skin: 0,
        name: "dsds",
        prefix: "sd",
        placement: "8th",
      },
    });
  };

  const handlePlayerChange = (playerKey, field, value) => {
    setPlayerData((prevPlayerData) => ({
      ...prevPlayerData,
      [playerKey]: {
        ...prevPlayerData[playerKey],
        [field]: value,
      },
    }));
  };

  const getCharacterDetails = (characterKey) => {
    const character = characterList.find(
      (character) => character.key === Number(characterKey)
    );
    return character ? character.images[0] : { icons: [], displayImages: [] };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ eventName, date, playerData });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 p-8 `}>
      <div className="flex flex-col 2xl:flex-row">
        <div className="flex flex-col w-full p-2">
          <label htmlFor="eventName" className="text-lg font-semibold">
            Tournament Name:
          </label>
          <input
            id="eventName"
            name="eventName"
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="flex flex-col w-full p-2">
          <label htmlFor="date" className="text-lg font-semibold">
            Date:
          </label>
          <input
            required
            id="date"
            name="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          />
        </div>
      </div>

      <div className="flex flex-col 2xl:grid 2xl:grid-cols-2">
        {Object.keys(playerData).map((playerKey, index) => {
          const player = playerData[playerKey];
          const { icons, displayImages } = getCharacterDetails(
            player.character
          );
          const currentImage = displayImages[player.skin] || displayImages[0]; // Default to the first display image if no skin selected
          return (
            <div
              key={playerKey}
              className="flex flex-col space-y-2 bg-slate-300 rounded-2xl p-6 m-2"
            >
              <label
                htmlFor={"playerName" + index + 1}
                className="text-lg  font-semibold"
              >
                Player {index + 1} Name:
              </label>
              <input
                required
                id={"playerName" + index + 1}
                name={"playerName" + index + 1}
                type="text"
                value={player.name}
                onChange={(e) =>
                  handlePlayerChange(playerKey, "name", e.target.value)
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <label
                htmlFor={"prefix" + index + 1}
                className="text-lg  font-semibold"
              >
                Prefix:
              </label>
              <input
                required
                id={"prefix" + index + 1}
                name={"prefix" + index + 1}
                type="text"
                value={player.prefix}
                onChange={(e) =>
                  handlePlayerChange(playerKey, "prefix", e.target.value)
                }
                className="border border-gray-300 rounded-md p-2"
              />
              <label
                htmlFor={"character" + index + 1}
                className="text-lg font-semibold"
              >
                Character:
              </label>
              <select
                required
                id={"character" + index + 1}
                name={"character" + index + 1}
                value={player.character}
                onChange={(e) =>
                  handlePlayerChange(playerKey, "character", e.target.value)
                }
                className="border border-gray-300 rounded-md p-2"
              >
                {characterList.map((character) => (
                  <option key={character.key} value={character.key}>
                    {character.name}
                  </option>
                ))}
              </select>
              {player.character !== 0 && (
                <>
                  <div className="grid grid-cols-4 lg:grid-cols-8 mt-2">
                    {icons.map((icon, skinIndex) => (
                      <div
                        key={skinIndex}
                        className={`cursor-pointer m-2 2xl:m-1 border rounded-md p-1 ${
                          player.skin === skinIndex
                            ? "border-blue-500"
                            : "border-gray-300"
                        }`}
                        onClick={() =>
                          handlePlayerChange(playerKey, "skin", skinIndex)
                        }
                      >
                        <img
                          src={icon}
                          alt={`Icon ${skinIndex}`}
                          className="w-12 h-12 2xl:w-8 2xl:h-8 object-cover m-auto"
                        />
                      </div>
                    ))}
                  </div>
                  <img
                    src={currentImage}
                    alt="Selected Character"
                    className="w-40 h-40 rounded-full mx-auto object-cover mt-2"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
      >
        Generate Graphic
      </button>
      <button
        onClick={handleAutofillTest}
        type="button"
        className="bg-blue-500 text-white rounded-md py-2 px-4 hover:bg-blue-600"
      >
        Autofill{" "}
      </button>
    </form>
  );
};

export default Top8Form;

Top8Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
