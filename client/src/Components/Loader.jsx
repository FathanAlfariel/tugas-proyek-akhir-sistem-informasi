import React from "react";

const Loader = () => {
  return (
    <>
      <div className="fixed top-0 left-0 z-50">
        <div className="fixed top-0 left-0 w-full h-full bg-black/[.25]"></div>
        <div className="loader"></div>
      </div>
    </>
  );
};

export default Loader;
