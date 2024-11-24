import React, { useState } from "react";

const Tabs = ({ menu }) => {
  const [isSelected, setIsSelected] = useState(0);

  const handleIsSelected = (key) => {
    setIsSelected(key);
  };

  return (
    <>
      <ul className="flex items-center gap-x-4 border-b overflow-x-auto">
        {menu.map((item, key) => {
          return (
            <li key={key} className="group relative">
              <button
                type="button"
                onClick={() => handleIsSelected(key)}
                className={`flex items-center gap-x-2 px-4 py-4 text-sm font-medium ${
                  isSelected === key ? "text-[#6750A4]" : "text-[#5F6368]"
                } transition-all active:scale-90 duration-300 text-nowrap`}
              >
                {item.label}
              </button>

              {isSelected === key ? (
                <div className="absolute bottom-0 left-0 w-full border-2 border-[#6750A4] rounded-t-full"></div>
              ) : (
                <div className="hidden group-hover:block absolute bottom-0 left-0 w-full border-2 rounded-t-full bg-[#49454F]/[.08]"></div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="py-3 w-full">{menu[isSelected].content}</div>
    </>
  );
};

export default Tabs;
