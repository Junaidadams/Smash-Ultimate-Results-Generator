import Top8Display from "../components/Top8Display";
import Top8Form from "../components/Top8Form";
import { useState } from "react";

const Home = () => {
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = (data) => {
    setSubmittedData(data);
  };

  return (
    <main className="min-w-screen min-h-screen bg-gradient-to-b from-[#E8F5E9] to-[#F5FBEF] z-0 flex items-center justify-center">
      <section className="w-full bg-[#fcfcfc] sm:w-2/3 md:w-1/2 2xl:w-3/5 mx-auto min-h-screen shadow-2xl rounded-lg overflow-hidden">
        <div className="px-8 pt-8 lg:px-16 flex flex-col">
          <h1 className="text-5xl p-4 font-extrabold text-[#2c3441]">
            Top 8 Result Generator
          </h1>
          <p className="p-4 text-lg text-[#4B5563] font-medium">
            Generate sleek and professional Top 8 results for your event.
          </p>
        </div>

        <div
          className={`
          } p-8 lg:p-16 transition-all duration-300`}
        >
          <Top8Form onSubmit={handleFormSubmit} />
        </div>
        <div className="max-w-full max-h-full p-8 lg:p-16">
          {submittedData ? (
            <Top8Display
              eventName={submittedData.eventName}
              date={submittedData.date}
              playerData={submittedData.playerData}
            />
          ) : (
            <p className="text-center text-gray-500">No data submitted yet</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
