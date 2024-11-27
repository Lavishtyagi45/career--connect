import React from "react";

const MainContent = () => {
  return (
    <main className="flex flex-col justify-center items-center px-4 py-40 w-full bg-black text-white border border-solid border-black min-h-[500px] max-md:py-20 max-md:px-4">
      {/* Title */}
      <h1 className="text-4xl lg:text-5xl font-bold max-md:text-3xl">
        CAREERCONNECT
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-xl lg:text-2xl max-md:text-lg text-center">
        Bridge the gap between academics and profession
      </p>

      {/* Action Buttons */}
      <div className="flex gap-6 justify-center items-center mt-6 text-lg">
        <a href="/coming-soon">
        <button
          className="px-4 py-2 bg-zinc-600 rounded hover:bg-gray-400 transition"
        >
          Practice
        </button>
        </a>
        <a  href="/signup">
        <button
          className="px-4 py-2 bg-zinc-600 rounded hover:bg-gray-400 transition"
        >
          Connect
        </button>
        </a>
      </div>
    </main>
  );
};

export default MainContent;
