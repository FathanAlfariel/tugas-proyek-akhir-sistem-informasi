import React, { useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

const Carousel = ({ images, className }) => {
  const [current, setCurrent] = useState(0);

  const prevSlide = (e) => {
    e.preventDefault(); // Mencegah default navigasi
    if (current === 0) {
      setCurrent(images.length - 1);
    } else {
      setCurrent((prev) => prev - 1);
    }
  };

  const nextSlide = (e) => {
    e.preventDefault(); // Mencegah default navigasi
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

        <div className="absolute top-0 h-full w-full px-2.5 transition-all opacity-0 group-hover:opacity-100 flex justify-between items-center ease-in-out duration-200 z-50">
          <button
            type="button"
            onClick={prevSlide}
            className={`${
              current === 0 && "invisible"
            } flex justify-center items-center p-1.5 rounded-full bg-white/[.9] shadow-lg transition hover:scale-105 hover:bg-white duration-300`}
          >
            <IoIosArrowBack className="text-base md:text-lg text-black" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className={`${
              current === images.length - 1 && "invisible"
            } flex justify-center items-center p-1.5 rounded-full bg-white/[.9] shadow-lg transition hover:scale-105 hover:bg-white duration-300`}
          >
            <IoIosArrowForward className="text-base md:text-lg text-black" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
