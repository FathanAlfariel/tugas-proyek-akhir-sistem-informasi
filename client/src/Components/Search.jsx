import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";

const Search = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleShowSuggestions = () => {
    setShowSuggestions(true);
  };

  useEffect(() => {
    if (showSuggestions) {
      window.addEventListener("click", (e) => {
        if (!document.getElementById("search-bar").contains(e.target)) {
          setShowSuggestions(false);
        }
      });
    }
  }, [showSuggestions]);

  return (
    <>
      <div id="search-bar" className="relative">
        <button
          onClick={handleShowSuggestions}
          type="button"
          className="w-full px-4 py-2 flex items-center gap-x-2.5 border rounded-full transition-all active:scale-90 duration-300 shadow-none hover:shadow"
        >
          <IoSearchSharp className="text-2xl text-[#49454F]" />
          <p className="text-[#49454F] text-sm">Search</p>
        </button>

        {showSuggestions && (
          <div className="absolute inset-0 z-10">
            <div className="w-full px-4 py-2 flex items-center gap-x-2.5 border rounded-full shadow">
              <IoSearchSharp className="text-2xl text-[#49454F]" />
              <input
                type="text"
                placeholder="Search"
                className="outline-none placeholder:text-[#49454F] text-sm"
                autoFocus
              />
            </div>

            <div className="w-full bg-white shadow rounded-xl py-4 mt-1">
              Search bar
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
