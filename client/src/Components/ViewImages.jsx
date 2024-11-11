import React, { useEffect } from "react";

const ViewImages = ({ filename, onClose }) => {
  // Disable scrolling
  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = "hidden";

    // Enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <div className="relative z-50 overflow-hidden">
        <div
          className="fixed top-0 left-0 right-0 w-screen h-screen bg-black/[0.7]"
          onClick={onClose}
        >
          <img
            src={`http://localhost:5000/public/images/${filename}`}
            alt={filename}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default ViewImages;
