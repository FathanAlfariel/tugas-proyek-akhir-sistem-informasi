import React, { useEffect, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";

const DropdownSelect = ({
  id,
  button,
  selectMenu,
  defaultValue,
  menuSize = "default",
  menuUpOrDown = "down",
  menuDirection = "left",
  minWidth = undefined,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    const menu = selectMenu?.find((menu) => menu?.value === defaultValue);
    if (menu) {
      setSelectedMenu(menu.value);
    } else {
      setSelectedMenu(null);
    }
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!document.getElementById(id)?.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      window.addEventListener("click", handleClickOutside);
    } else {
      window.removeEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen, id]);

  return (
    <>
      {/* Dropdown select */}
      <div id={id} className="relative">
        {/* Button */}
        <div
          className="w-full"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {button}
        </div>

        {/* Dropdown select menu */}
        {isDropdownOpen && (
          <>
            {/* Dropdown select menu for tablet, desktop */}
            <div
              className={`hidden absolute ${
                menuUpOrDown === "down" ? "top-0" : "bottom-0"
              } ${
                menuDirection === "left" ? "left-0" : "right-0"
              } shadow bg-white ${
                minWidth === undefined ? "min-w-40" : minWidth
              } py-2.5 rounded-2xl border border-[#F1F1F1] z-10 ${
                isDropdownOpen ? "block" : "hidden"
              } md:block ${
                menuSize === "small" ? "max-h-36" : ""
              } overflow-y-auto`}
            >
              <ul className="flex flex-col gap-y-0.5">
                {selectMenu.map((menu, key) => {
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          menu.handleMenuClicked();
                          setIsDropdownOpen(false);
                        }}
                        className={`flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left whitespace-nowrap ${
                          menuSize === "small" ? "text-xs" : "text-sm"
                        } hover:bg-[#1D1B20]/[.08]`}
                      >
                        {menu?.value === selectedMenu ? (
                          <span>
                            <IoCheckmarkSharp
                              className={`${
                                menuSize === "small" ? "text-base" : "text-xl"
                              }`}
                            />
                          </span>
                        ) : (
                          <span>
                            <IoCheckmarkSharp
                              className={`invisible ${
                                menuSize === "small" ? "text-base" : "text-xl"
                              }`}
                            />
                          </span>
                        )}
                        {menu.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Dropdown select menu for mobile */}
            <div className="block md:hidden fixed bottom-3 left-3 right-3 z-50">
              {/* Backdrop */}
              <div
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className="fixed top-0 left-0 h-full w-full bg-black/[.25] -z-40"
              ></div>

              <div className="bg-white rounded-2xl border border-[#F1F1F1]">
                <ul className="flex flex-col gap-y-0.5 py-2.5 z-10 max-h-60 overflow-y-auto">
                  {selectMenu.map((menu, key) => {
                    return (
                      <li key={key}>
                        <button
                          type="button"
                          onClick={() => {
                            menu.handleMenuClicked();
                            setIsDropdownOpen(false);
                          }}
                          className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                        >
                          {menu?.value === selectedMenu ? (
                            <span>
                              <IoCheckmarkSharp className="text-2xl" />
                            </span>
                          ) : (
                            <span>
                              <IoCheckmarkSharp className="invisible text-2xl" />
                            </span>
                          )}
                          {menu.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="border-t py-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                  >
                    <MdClose className="text-2xl" />
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DropdownSelect;
