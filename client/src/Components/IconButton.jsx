import React from "react";

const IconButton = ({ children }) => {
  return (
    <>
      <button className="p-2 rounded-full hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] transition-all active:scale-90 duration-300">
        <span className="text-2xl text-[#49454F]">{children}</span>
      </button>
    </>
  );
};

export default IconButton;
