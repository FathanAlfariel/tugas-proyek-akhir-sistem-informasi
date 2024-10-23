import React, { useState } from "react";
import { IoEye, IoEyeOff, IoWarning } from "react-icons/io5";

const Input = ({ id, label, type, placeholder }) => {
  // Handle Show / Hidden Password
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  return (
    <>
      {type === "password" ? (
        <div className="w-full py-2 px-3 flex border-2 rounded-xl text-sm">
          <div className="flex flex-col w-full">
            <label htmlFor={id} className="text-[#52525B]">
              {label}
            </label>

            <input
              id={id}
              className="outline-none"
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              placeholder={placeholder}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleShowPassword}
              className="hover:bg-gray-100 p-2.5 rounded-full mr-1"
            >
              {showPassword ? (
                <IoEyeOff className="text-black text-xl" />
              ) : (
                <IoEye className="text-black text-xl" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full py-2 px-3 flex flex-col border-2 rounded-xl text-sm">
          <label htmlFor={id} className="text-[#52525B]">
            {label}
          </label>

          <input
            id={id}
            className="outline-none"
            type={type}
            placeholder={placeholder}
          />
        </div>
      )}
    </>
  );
};

export default Input;
