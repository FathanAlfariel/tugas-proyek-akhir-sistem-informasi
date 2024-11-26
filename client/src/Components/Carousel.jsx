import React, { useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Carousel = ({ images, className }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    if (current === 0) {
      setCurrent(images.length - 1);
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  const nextSlide = () => {
    if (current === images.length - 1) {
      setCurrent(0);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden group">
        <div
          className="flex transition ease-auto duration-300"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {images.map((img, key) => {
            return (
              <img
                key={key}
                src={`http://localhost:5000/public/images/${img?.name}`}
                alt={img?.name}
                className={className}
              />
            );
          })}
        </div>

        <div className="absolute top-0 h-full w-full px-2.5 transition-all opacity-0 group-hover:opacity-100 flex justify-between items-center ease-in-out duration-200 z-10">
          <button
            type="button"
            onClick={prevSlide}
            className="flex justify-center items-center p-1.5 rounded-full bg-white shadow-lg"
          >
            <IoIosArrowBack className="text-lg text-black" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="flex justify-center items-center p-1.5 rounded-full bg-white shadow-lg"
          >
            <IoIosArrowForward className="text-lg text-black" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Carousel;