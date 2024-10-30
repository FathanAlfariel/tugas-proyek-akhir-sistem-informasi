import React from "react";

const TextArea = ({ name, id, placeholder, label }) => {
  return (
    <>
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
          ></textarea>
        </div>
      </div>
    </>
  );
};

export default TextArea;
