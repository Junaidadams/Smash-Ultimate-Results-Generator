import Top8Display from "../components/Top8Display";
import Top8Form from "../components/Top8Form";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Home = () => {
  const [submittedData, setSubmittedData] = useState(null);
  const [toggle, setToggle] = useState(true);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
    handleToggle(false);
  };
  const handleToggle = (newState) => {
    setToggle(newState);
  };
  return (
    <main className="bg-gradient-to-r  min-w-screen min-h-screen bg-white z-0">
      <section className="w-full bg-slate-50 sm:w-2/3 md:w-1/2 mx-auto">
        <div className="px-8 pt-8">
          <h1 className="text-3xl font-bold">Top 8 Result Generator</h1>
          <p className="py-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque
            minima quasi cum laboriosam magnam at aut aspernatur laborum fugiat.
            Tempore earum necessitatibus vitae aliquam tenetur consequatur fuga
            optio, dignissimos sunt.
          </p>
          {toggle ? (
            <button
              className="bg-slate-300 rounded-2xl px-4"
              onClick={() => handleToggle(false)}
            >
              <ChevronUp color="black" />
            </button>
          ) : (
            <button
              className="bg-slate-300 rounded-2xl px-4"
              onClick={() => handleToggle(true)}
            >
              <ChevronDown color="black" />
            </button>
          )}
        </div>

        <div className={`${!toggle && "hidden"}`}>
          <Top8Form onSubmit={handleFormSubmit} />
        </div>
        <div className=" max-w-full max-h-full">
          {submittedData ? (
            <Top8Display
              eventName={submittedData.eventName}
              date={submittedData.date}
              playerData={submittedData.playerData}
            />
          ) : (
            <p>No data submitted yet</p> // Optional: Add a placeholder when no data is submitted
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
