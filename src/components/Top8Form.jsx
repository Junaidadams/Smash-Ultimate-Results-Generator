import { useState } from "react";
import { characterList } from "../../constants";
import PropTypes from "prop-types";
import axios from "axios";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Loader2,
  CheckCircle,
} from "lucide-react";

const Top8Form = ({ onSubmit }) => {
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState("");
  const [toggle, setToggle] = useState(true);
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

  const [eventLink, setEventLink] = useState("");

  const handleToggle = (newState) => {
    setToggle(newState);
  };

  const handlePlayerChange = (playerKey, field, value) => {
    setPlayerData((prevPlayerData) => ({
      ...prevPlayerData,
      [playerKey]: {
        ...prevPlayerData[playerKey],
        [field]: field === "character" ? Number(value) : value, // Ensure value is a number for character
      },
    }));
  };

  const getCharacterDetails = (characterKey) => {
    if (characterKey === 0) {
      return {
        icons: [],
        displayImages: ["../assets/characters/nochar.png"],
      };
    }

    const character = characterList.find(
      (character) => character.key === Number(characterKey)
    );
    return character ? character.images[0] : { icons: [], displayImages: [] };
  };

  const fetchEventData = async (url) => {
    const eventSlug = "tournament/" + extractEventSlug(url);
    setLoading(true);
    setSuccess(false);

    if (eventSlug) {
      try {
        // Fetch event data and standings with character details from the combined backend endpoint
        const response = await axios.post(
          "http://localhost:3000/api/event-data",
          {
            slug: eventSlug,
            page: 1,
            perPage: 8,
          }
        );

        const eventData = response.data.event; // Use 'event' directly as per the combined response structure
        console.log(eventData);
        const { name, standings } = eventData;

        if (!standings || !standings.nodes || !Array.isArray(standings.nodes)) {
          throw new Error("Standings data is missing or not an array");
        }

        // Map the standings to player data
        const updatedPlayerData = standings.nodes.reduce(
          (acc, stand, index) => {
            if (!stand.entrant) {
              console.warn(`Entrant data is missing for index ${index}`);
              return acc;
            }

            const playerName = stand.entrant.name;
            const [prefix, name] = playerName.includes("|")
              ? playerName.split("|").map((part) => part.trim())
              : ["", playerName.trim()];

            acc[`player${index + 1}`] = {
              name,
              prefix,
              placement: `${stand.placement}${getPlacementSuffix(
                stand.placement
              )}`,
              character: stand.entrant.character || {
                id: 0,
                name: "",
                images: { icons: [], displayImages: [] },
              },
            };

            return acc;
          },
          {}
        );

        setEventName(name || "");
        setDate(""); // Set the date if it's available
        setPlayerData(updatedPlayerData);
        handleToggle();
        setSuccess(true);
        console.log(updatedPlayerData);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to extract the full event slug from the URL
  const extractEventSlug = (url) => {
    const match = url.match(/tournament\/([^/]+\/event\/[^/]+)/);
    // console.log(match);
    return match ? match[1] : null;
  };

  const getPlacementSuffix = (placement) => {
    switch (placement) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ eventName, date, playerData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col">
      <div className="flex flex-col  w-full p-4">
        <div className="m-auto w-full flex flex-col px-8 lg:px-16">
          {/* <label
            htmlFor="eventLink"
            className="text-xl font-semibold mx-auto mb-4 text-slate-700"
          >
            Event Link:
          </label> */}

          <input
            id="eventLink"
            name="eventLink"
            placeholder="https://www.start.gg/tournament/genesis-9-1/event/ultimate-singles"
            type="text"
            value={eventLink}
            onChange={(e) => setEventLink(e.target.value)}
            className="border border-gray-300 rounded-md p-2 focus:border-gray-400 focus:outline-none w-full mx-auto"
          />
        </div>
        <button
          type="button"
          onClick={() => fetchEventData(eventLink)}
          className="
          bg-gradient-to-tr from-[#719145] to-[#77a536]
          mt-6 text-white flex flex-row m-auto rounded-2xl py-3 px-4 hover:bg-[#86a161] focus:border-gray-400 space-x-2 shadow-lg"
        >
          <span className="bg-[#2c3441] p-1 sha rounded-full">
            {loading ? (
              <Loader2 size={20} className=" animate-spin" />
            ) : success && !loading ? (
              <CheckCircle size={20} />
            ) : (
              <Search size={20} />
            )}
          </span>
          <p className="my-auto font-semibold text-base">Fetch Data</p>
        </button>
      </div>
      <div className="mx-auto">
        {" "}
        {toggle ? (
          <button
            className="bg-gray-30 mx-auto w-fit rounded-2xl my-4 px-4 py-2 hover:bg-gray-40 transition"
            onClick={() => handleToggle(false)}
          >
            <ChevronUp color="black" />
          </button>
        ) : (
          <button
            className="bg-gray-30 mx-auto w-fit rounded-2xl my-4 px-4 py-2 hover:bg-gray-40 transition"
            onClick={() => handleToggle(true)}
          >
            <ChevronDown color="black" />
          </button>
        )}
      </div>
      <div className={`${toggle && "hidden"} px-8 lg:px-16`}>
        <div className=" flex flex-col 2xl:flex-row">
          <div className="flex flex-col w-full p-4">
            <label
              htmlFor="eventName"
              className="text-lg font-semibold text-slate-700"
            >
              Tournament Name:
            </label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="border border-gray-300 rounded-md p-2 focus:border-gray-400 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col w-full p-4">
            <label
              htmlFor="date"
              className="text-lg font-semibold text-slate-700"
            >
              Date:
            </label>
            <input
              required
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 "
            />
          </div>
        </div>
        <div className="flex flex-col 2xl:grid 2xl:grid-cols-2">
          {Object.keys(playerData).map((playerKey, index) => {
            const player = playerData[playerKey];
            const { icons, displayImages } = getCharacterDetails(
              player.character
            );
            const currentImage =
              displayImages[player.skin] ||
              displayImages[0] ||
              "../assets/characters/nochar.png";
            return (
              <div
                key={playerKey}
                className="flex flex-col space-y-2 bg-[#D4DFC7] shadow-2xl rounded-lg p-6 m-4"
              >
                <label
                  htmlFor={"playerName" + index + 1}
                  className="text-lg font-semibold text-slate-800"
                >
                  Player {index + 1} Name:
                </label>
                <div className="flex w-full">
                  {/* <label
                    htmlFor={"prefix" + index + 1}
                    className="text-lg font-semibold text-slate-800"
                  >
                    Prefix:
                  </label> */}
                  <input
                    id={"prefix" + index + 1}
                    name={"prefix" + index + 1}
                    type="text"
                    value={player.prefix}
                    onChange={(e) =>
                      handlePlayerChange(playerKey, "prefix", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2  focus:border-gray-400 focus:outline-none w-1/3 mr-0 rounded-r-none"
                  />
                  <input
                    required
                    id={"playerName" + index + 1}
                    name={"playerName" + index + 1}
                    type="text"
                    value={player.name}
                    onChange={(e) =>
                      handlePlayerChange(playerKey, "name", e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-2  focus:border-gray-400 focus:outline-none w-full ml-0 lg:ml-3 rounded-l-none"
                  />
                </div>
                <label
                  htmlFor={"character" + index + 1}
                  className="text-lg font-semibold text-slate-800"
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
                  className="border border-gray-300 rounded-md p-2  focus:border-gray-400 focus:outline-none"
                >
                  <option value={0}>-- Select --</option>
                  {characterList.map((character) => (
                    <option
                      key={character.key}
                      value={character.key}
                      className=""
                    >
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
                              ? "border-slate-800 bg-slate-400"
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
                      src={
                        !currentImage
                          ? "../assets/characters/nochar.png"
                          : currentImage
                      }
                      alt="Selected Character"
                      className="w-40 h-40 rounded-full mx-auto object-cover mt-2"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-full p-4">
          <button
            type="submit"
            className="mt-6 bg-[#719145] text-white rounded-sm py-2 px-4 hover:bg-[#86a161] focus:border-gray-400"
          >
            Generate Graphic
          </button>
        </div>
      </div>
    </form>
  );
};

export default Top8Form;

Top8Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
