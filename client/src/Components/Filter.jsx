import React, { useEffect, useRef, useState } from "react";
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
  disabledButton = false,
}) => {
  const parentRef = useRef(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const menuPosition =
    menuDirection === "left"
      ? "md:left-0 md:right-auto"
      : menuDirection === "right"
      ? "right-0 md:left-auto"
      : null;

  const handleClickOutside = (event) => {
    // Cek apakah klik terjadi di luar parentRef
    if (parentRef.current && !parentRef.current.contains(event.target)) {
      setShowFilterMenu(false); // Menutup menu jika klik di luar
    }
  };

  useEffect(() => {
    // Menambahkan event listener ketika komponen pertama kali dimounting
    document.addEventListener("mousedown", handleClickOutside);

    // Membersihkan event listener ketika komponen di-unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={parentRef} id={id} className="relative">
        <div
          onClick={() => setShowFilterMenu((prev) => !prev)}
          className="whitespace-nowrap"
        >
          {button}
        </div>

        {showFilterMenu && (
          <div
            className={`min-w-auto md:min-w-52 fixed top-auto bottom-3 left-3 right-3 md:bottom-auto md:absolute md:top-auto mt-0 md:mt-1 ${menuPosition} shadow bg-white rounded-2xl border border-[#F1F1F1] z-50`}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-1 pl-3 pr-1">
              <h5 className="text-sm font-medium line-clamp-1">
                {headerTitle}
              </h5>

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
                disabled={disabledButton}
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
