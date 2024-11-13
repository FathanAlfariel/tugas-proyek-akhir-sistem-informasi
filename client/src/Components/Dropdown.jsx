import React, { useEffect, useState } from "react";
import { IoCheckmarkSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";

const Dropdown = ({
  id,
  button,
  menuDirection = "left",
  minWidth = undefined,
  selectMenu,
  defaultValue,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    const menu = selectMenu?.find((menu) => menu?.value === defaultValue);
    if (menu) {
      setSelectedMenu(menu.value);
    }
  }, [defaultValue, selectMenu]);

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
    <div id={id} className="inline-flex relative">
      {/* Button */}
      <div onClick={() => setIsDropdownOpen(!isDropdownOpen)}>{button}</div>

      {/* Dropdown select menu */}
      {isDropdownOpen && (
        <>
          {/* Dropdown select menu for tablet, desktop */}
          <div
            className={`absolute top-0 ${
              menuDirection === "left" ? "left-0" : "right-0"
            } shadow bg-white ${
              minWidth === undefined ? "min-w-40" : minWidth
            } py-2.5 rounded-2xl border border-[#F1F1F1] z-10 ${
              isDropdownOpen ? "block" : "hidden"
            } md:block`}
          >
            <ul className="flex flex-col gap-y-0.5">
              {selectMenu.map((menu, key) => {
                return (
                  <li key={key}>
                    {menu.type === "link" ? (
                      <Link to={menu.url}>
                        <button className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]">
                          <span className="text-xl">{menu.icon}</span>
                          {menu.label}
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          menu.handleMenuClicked();
                          setIsDropdownOpen(false);
                        }}
                        className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                      >
                        {menu?.value === selectedMenu ? (
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
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Dropdown select menu for mobile */}
          <div className="block md:hidden fixed bottom-3 left-3 right-3 z-50">
            {/* Backdrop */}
            <div
              onClick={() => setIsDropdownOpen(false)}
              className="fixed top-0 left-0 h-full w-full bg-black/[.25] -z-40"
            ></div>

            <div className="bg-white rounded-2xl border border-[#F1F1F1]">
              <ul className="flex flex-col gap-y-0.5 py-2.5 z-10 max-h-60 overflow-y-auto">
                {selectMenu.map((menu, key) => {
                  return (
                    <li key={key}>
                      <button
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
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                >
                  <MdClose className="text-2xl" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
