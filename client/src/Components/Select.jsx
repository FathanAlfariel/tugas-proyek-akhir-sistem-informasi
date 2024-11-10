import React, { useEffect, useState } from "react";
import {
  IoChevronDownOutline,
  IoCheckmarkSharp,
  IoSearchSharp,
} from "react-icons/io5";

const Select = ({
  id,
  label,
  placeholder,
  selectMenu,
  setSelectMenu,
  showSearch,
  defaultValue,
  value,
  errorMessage,
  disabled = false,
}) => {
  const [showSelectMenu, setShowSelectMenu] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  const [filteredMenu, setFilteredMenu] = useState();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setFilteredMenu(selectMenu);
  }, [selectMenu]);

  const handleShowSelectMenu = () => {
    setShowSelectMenu((prev) => !prev);
  };

  // Closes the menu when the user clicks outside the div
  useEffect(() => {
    if (showSelectMenu) {
      window.addEventListener("click", (e) => {
        if (!document.getElementById(id).contains(e.target)) {
          setShowSelectMenu(false);
        }
      });
    }
  }, [showSelectMenu]);

  const handleSelectedMenu = (menu) => {
    setSelectedMenu(menu);
    value(menu?.value);
  };

  // If the selected menu has been initialized
  useEffect(() => {
    const menu = selectMenu?.filter((menu) => menu?.value === defaultValue);

    if (menu) {
      setSelectedMenu(menu[0]);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (searchValue === "") {
      setFilteredMenu(selectMenu);
      return;
    }

    const filteredItems = selectMenu.filter((item) =>
      item.label.toLowerCase().includes(searchValue)
    );

    setFilteredMenu(filteredItems);
  }, [searchValue]);

  return (
    <>
      <div id={id} className="relative">
        <button
          onClick={handleShowSelectMenu}
          type="button"
          className="w-full flex items-center py-2 px-3 border-2 rounded-xl text-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
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
                    onChange={(e) =>
                      setSearchValue(e.target.value.toLowerCase())
                    }
                  />
                </div>
              </div>
            )}

            <ul className="flex flex-col gap-y-0.5">
              {filteredMenu?.length > 0 ? (
                filteredMenu.map((menu, key) => (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectedMenu(menu);
                        setSearchValue("");
                        setShowSelectMenu(false);
                      }}
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
                ))
              ) : (
                // Jika sedang mencari dan tidak ada hasil
                <li className="text-center py-2 text-sm text-gray-500">
                  Tidak ada data yang cocok
                </li>
              )}
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
