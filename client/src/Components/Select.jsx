import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Select = ({ label, placeholder, selectMenu }) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

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
    setShowSelectMenu(false);
  };

  return (
    <>
      <div id="select-menu" className="relative">
        <button
          onClick={handleShowSelectMenu}
          className="w-full flex items-center py-2 px-3 border-2 rounded-xl text-sm cursor-pointer"
        >
          <div className="grow flex flex-col text-left">
            <p className="text-[#52525B]">{label}</p>

            {selectedMenu ? (
              <span>{selectedMenu.label}</span>
            ) : (
              <span className="text-[#71717a]">{placeholder}</span>
            )}
          </div>

          <div>
            <IoIosArrowDown
              className={`text-base transition-all duration-300 ${
                showSelectMenu && "rotate-180"
              }`}
            />
          </div>
        </button>

        {showSelectMenu && (
          <div className="w-full absolute top-auto right-0 shadow bg-white py-2.5 rounded-xl border border-[#F1F1F1] z-10 mt-1">
            <ul>
              {selectMenu &&
                selectMenu.map((menu, key) => {
                  return (
                    <li key={key}>
                      <button
                        onClick={() => handleSelectedMenu(menu)}
                        className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                      >
                        {menu.label}
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Select;
