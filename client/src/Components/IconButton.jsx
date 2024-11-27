import React from "react";

const IconButton = ({ children, type, buttonType, onClick, title }) => {
  return (
    <>
      {buttonType === "primary" ? (
        <button
          type={type}
          onClick={onClick}
          title={title}
          className="p-2 rounded-full bg-[#6750A4] hover:bg-[#6750A4]/[.85] active:[#49454F]/[.75] transition-all active:scale-90 duration-300"
        >
          <span className="text-2xl text-white">{children}</span>
        </button>
      ) : buttonType === "icon" ? (
        <button
          type={type}
          onClick={onClick}
          title={title}
          className="p-2 rounded-full hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] transition-all active:scale-90 duration-300"
        >
          <span className="text-2xl text-[#49454F]">{children}</span>
        </button>
      ) : null}
    </>
  );
};

export default IconButton;
