import React, { useState } from "react";
import IconButton from "./IconButton";
import { IoMdClose } from "react-icons/io";
import Button from "./Button";

const Filter = ({
  id,
  button,
  menuDirection = "left",
  headerTitle,
  children,
  onClick,
}) => {
  const [showFilterMenu, setShowFilterMenu] = useState();

  const menuPosition =
    menuDirection === "left"
      ? "md:left-0 md:right-auto"
      : menuDirection === "right"
      ? "right-0 md:left-auto"
      : null;

  return (
    <>
      <div id={id} className="relative">
        <div onClick={() => setShowFilterMenu((prev) => !prev)}>{button}</div>

        {showFilterMenu && (
          <div
            className={`min-w-auto md:min-w-52 fixed top-auto bottom-3 left-3 right-3 md:bottom-auto md:absolute md:top-auto mt-0 md:mt-1 ${menuPosition} shadow bg-white rounded-2xl border border-[#F1F1F1] z-50`}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-1 pl-3 pr-1">
              <h5 className="text-sm font-medium">{headerTitle}</h5>

              <IconButton
                type="button"
                buttonType="icon"
                onClick={() => setShowFilterMenu(false)}
              >
                <IoMdClose />
              </IconButton>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#CAC4D0]"></div>

            {/* Body / Main Content */}
            <div className="p-3">{children}</div>

            {/* Divider */}
            <div className="w-full h-px bg-[#CAC4D0]"></div>

            <div className="flex justify-end py-2 px-2">
              <Button
                type="button"
                buttonStyle="tonal-button"
                onClick={onClick}
              >
                Apply
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Filter;
