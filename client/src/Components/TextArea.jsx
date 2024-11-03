import React from "react";
import { IoWarning } from "react-icons/io5";

const TextArea = ({
  name,
  id,
  placeholder,
  label,
  onChange,
  onBlur,
  value,
  errorMessage,
}) => {
  return (
    <>
      <div className="flex flex-col">
        <div className="w-full py-2 px-3 flex border-2 rounded-xl text-sm">
          <div className="flex flex-col w-full">
            <label htmlFor={id} className="text-[#52525B]">
              {label}
            </label>

            <textarea
              name={name}
              id={id}
              placeholder={placeholder}
              className="outline-none"
              rows={6}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
            ></textarea>
          </div>
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
      </div>
    </>
  );
};

export default TextArea;
