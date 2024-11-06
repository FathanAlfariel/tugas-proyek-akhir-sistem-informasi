import React, { useEffect, useState } from "react";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";

const Select = ({
  label,
  placeholder,
  selectMenu,
  defaultValue,
  value,
  errorMessage,
}) => {
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
    value(menu.value);

    setShowSelectMenu(false);
  };

  // If the selected menu has been initialized
  useEffect(() => {
    const menu = selectMenu.filter((menu) => menu.value === defaultValue);

    setSelectedMenu(menu[0]);
  }, [defaultValue]);

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
              <input
                className="outline-none cursor-pointer"
                value={selectedMenu.label}
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
          <div className="w-full absolute top-auto right-0 shadow bg-white py-2.5 rounded-2xl border border-[#F1F1F1] z-10 mt-1">
            <ul className="flex flex-col gap-y-0.5">
              {selectMenu &&
                selectMenu.map((menu, key) => {
                  return (
                    <li key={key}>
                      <button
                        onClick={() => handleSelectedMenu(menu)}
                        className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                      >
                        {selectedMenu.value === menu.value ? (
                          <span>
                            <IoCheckmarkSharp className="text-xl" />
                          </span>
                        ) : (
                          <span>
                            <IoCheckmarkSharp className="invisible text-xl" />
                          </span>
                        )}

                        {menu.label}
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
