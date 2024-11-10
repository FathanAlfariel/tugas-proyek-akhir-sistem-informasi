import React, { useEffect, useState } from "react";
import {
  IoChevronDownOutline,
  IoCheckmarkSharp,
  IoSearchSharp,
} from "react-icons/io5";

const Select = ({
  label,
  placeholder,
  selectMenu,
  setSelectMenu,
  showSearch,
  defaultValue,
  value,
  errorMessage,
}) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [filteredMenu, setFilteredMenu] = useState([]);

  const handleShowSelectMenu = () => {
    setShowSelectMenu((prev) => !prev);
  };

  // Closes the menu when the user clicks outside the div
  useEffect(() => {
    if (showSelectMenu) {
      window.addEventListener("click", (e) => {
        if (!document.getElementById("select-menu").contains(e.target)) {
          setShowSelectMenu(false);
        }
      });
    }
  }, [showSelectMenu]);

  const handleSelectedMenu = (menu) => {
    setSelectedMenu(menu);
    value(menu?.value);

    setShowSelectMenu(false);
  };

  // If the selected menu has been initialized
  useEffect(() => {
    const menu = selectMenu?.filter((menu) => menu?.value === defaultValue);

    if (menu) {
      setSelectedMenu(menu[0]);
    }
  }, [defaultValue]);

  const handleSearch = (e) => {
    const filteredItems = selectMenu.filter((item) =>
      item.label.toLowerCase().includes(e.target.value.toLowerCase())
    );

    setFilteredMenu(filteredItems);
  };

  return (
    <>
      <div id="select-menu" className="relative">
        <button
          onClick={handleShowSelectMenu}
          type="button"
          className="w-full flex items-center py-2 px-3 border-2 rounded-xl text-sm cursor-pointer"
        >
          <div className="grow flex flex-col text-left">
            <p className="text-[#52525B]">{label}</p>

            {selectedMenu ? (
              <input
                className="outline-none cursor-pointer"
                value={selectedMenu?.label}
                readOnly
              />
            ) : (
              <span className="text-[#71717a]">{placeholder}</span>
            )}
          </div>

          <div>
            <IoChevronDownOutline
              className={`text-base transition-all duration-300 ${
                showSelectMenu && "rotate-180"
              }`}
            />
          </div>
        </button>

        {showSelectMenu && (
          <div
            className={`max-h-64 w-full absolute top-auto right-0 ${
              showSearch ? "pb-2.5" : "py-2.5"
            } shadow bg-white rounded-2xl border border-[#F1F1F1] z-10 mt-1 overflow-y-auto`}
          >
            {showSearch && (
              <div className="sticky top-0 py-2.5 bg-white">
                <div className="flex items-center gap-x-2.5 px-4 py-2 mx-2.5 border rounded-full">
                  <div className="text-xl text-[#49454F]">
                    <IoSearchSharp />
                  </div>

                  <input
                    type="text"
                    placeholder="Search"
                    className="outline-none w-full text-sm"
                    onChange={(e) => handleSearch(e)}
                  />
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-y-0.5">
              {filteredMenu.length > 0
                ? filteredMenu &&
                  filteredMenu.map((menu, key) => {
                    return (
                      <li key={key}>
                        <button
                          onClick={() => handleSelectedMenu(menu)}
                          className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                        >
                          {selectedMenu?.value === menu?.value ? (
                            <span>
                              <IoCheckmarkSharp className="text-xl" />
                            </span>
                          ) : (
                            <span>
                              <IoCheckmarkSharp className="invisible text-xl" />
                            </span>
                          )}

                          {menu?.label}
                        </button>
                      </li>
                    );
                  })
                : selectMenu &&
                  selectMenu.map((menu, key) => {
                    return (
                      <li key={key}>
                        <button
                          onClick={() => handleSelectedMenu(menu)}
                          className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                        >
                          {selectedMenu?.value === menu?.value ? (
                            <span>
                              <IoCheckmarkSharp className="text-xl" />
                            </span>
                          ) : (
                            <span>
                              <IoCheckmarkSharp className="invisible text-xl" />
                            </span>
                          )}

                          {menu?.label}
                        </button>
                      </li>
                    );
                  })}
            </ul>
          </div>
        )}
      </div>

      {errorMessage && (
        <>
          <div className="flex items-center mt-1.5">
            <IoWarning className="text-xs text-red-600 dark:text-red-500" />
            <p className="ml-1.5 text-xs text-red-600 dark:text-red-500">
              {errorMessage}
            </p>
          </div>
        </>
      )}
    </>
  );
};

export default Select;
