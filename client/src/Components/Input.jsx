import React, { useState } from "react";
import { IoEye, IoEyeOff, IoWarning } from "react-icons/io5";

const Input = ({
  id,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  errorMessage,
}) => {
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
              name={name}
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              className="outline-none"
              placeholder={placeholder}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
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
            name={name}
            type={type}
            placeholder={placeholder}
            className="outline-none"
            onChange={onChange}
            onBlur={onBlur}
            value={value}
          />
        </div>
      )}

      {errorMessage && (
        <>
          <div className="flex items-center mt-2">
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

export default Input;
