import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";

const Banner = ({ query, handleInputChange }) => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 md:py-20 py-14 px-4">
      <h1 className="text-5xl font-bold text-textPrimary mb-3">
        Find Your <span className="text-primary">New Job</span> Today!
      </h1>
      <p className="text-lg text-black/70 mb-8">
        Thousands of jobs in computer, engineering, and technology sectors are
        waiting for you!
      </p>
      <form>
        <div className="flex justify-start md:flex-row flex-col md:gap-0 gap-4 w-full">
          <div className="flex items-center md:rounded-s-none shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 md:w-1/2 w-full">
            <input
              type="text"
              name="title"
              id="title"
              placeholder="What position are you looking for?"
              className="block w-full border-0 bg-transparent py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              onChange={handleInputChange}
              value={query}
            />
            <FiSearch className="absolute mt-25 ml-2 text-gray-400" />
          </div>

          <div className="flex items-center md:rounded-s-none shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 md:w-1/3 w-full">
            <input
              type="text"
              name="location"
              id="location"
              placeholder="Location"
              className="block w-full border-0 bg-transparent py-1.5 pl-10 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            />
            <FiMapPin className="absolute mt-25 ml-2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-primary py-2 px-8 text-white md:rounded-s-none rounded mt-4 md:mt-0"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Banner;
