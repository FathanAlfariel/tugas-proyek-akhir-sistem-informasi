import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import ProductNameSearch from "./ProductNameSearch";
import { Link, useSearchParams } from "react-router-dom";
import PriceFilter from "./PriceFilter";
import axios from "axios";
import Button from "./Button";

const HomePageHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [showFilter, setShowFilter] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    console.log(e.target.product_name.value);

    // Buat salinan dari parameter saat ini
    const updatedParams = { ...currentParams };

    // Update title jika ada nilai
    if (e.target.product_name.value !== "") {
      updatedParams.title = e.target.product_name.value;
    } else {
      delete updatedParams.title;
    }

    // Update minPrice dan maxPrice jika ada nilai
    // if (e.target.min_price.value) {
    //   updatedParams.minPrice = e.target.min_price.value;
    // } else {
    //   delete updatedParams.minPrice;
    // }

    // if (e.target.max_price.value) {
    //   updatedParams.maxPrice = e.target.max_price.value;
    // } else {
    //   delete updatedParams.maxPrice;
    // }

    // Set semua perubahan dalam satu panggilan
    setSearchParams(updatedParams);
  };

  return (
    <>
      <header className="relative flex items-center mx-4 md:mx-6 mt-4 py-0 md:py-1.5">
        <div className="hidden md:inline-block relative z-10">
          <Link to="/">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 lg:w-24 h-auto object-contain"
            />
          </Link>
        </div>

        <div className="hidden md:flex justify-center absolute inset-0">
          <div className="static">
            <div
              onClick={() => setShowFilter((prev) => !prev)}
              className="h-full flex justify-center items-center gap-x-3 pl-4 pr-6 border rounded-full shadow-md hover:bg-zinc-100 cursor-pointer transition active:scale-90 duration-300"
            >
              <span className="text-2xl text-black">
                <IoIosSearch />
              </span>

              <div className="flex flex-col">
                <p className="text-sm font-semibold">Filter</p>

                <div className="flex items-center divide-x">
                  <p className="text-xs text-[#606060] pr-2">
                    Cari nama produk
                  </p>

                  <p className="text-xs text-[#606060] pl-2">
                    Urutkan berdasarkan harga
                  </p>
                </div>
              </div>
            </div>

            {showFilter && (
              <div className="absolute top-auto left-1/2 transform -translate-x-1/2 w-4/12 p-2 shadow-md rounded-2xl bg-zinc-100 z-[999] mt-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col gap-y-2"
                >
                  <div className="bg-white py-3 px-4 rounded-xl">
                    {/* Search by product's name */}
                    <ProductNameSearch />
                  </div>

                  {/* Button show product filter */}
                  <div className="bg-white py-3 px-4 rounded-xl">
                    <div
                      onClick={() => setShowProductFilter((prev) => !prev)}
                      className="sticky top-0 bg-white flex justify-between items-center cursor-pointer"
                    >
                      <p className="text-sm font-medium">Cari produk</p>

                      <div className="text-sm font-medium underline">Lihat</div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <Button type="submit" buttonStyle="text-button">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default HomePageHeader;
