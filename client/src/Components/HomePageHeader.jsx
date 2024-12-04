import React, { useEffect, useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import ProductNameSearch from "./ProductNameSearch";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import PriceFilter from "./PriceFilter";
import Button from "./Button";

const HomePageHeader = () => {
  const navigate = useNavigate();

  const filterRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [showFilter, setShowFilter] = useState(false);

  const [showProductFilter, setShowProductFilter] = useState(true);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Buat salinan dari parameter saat ini
    const updatedParams = { ...currentParams };

    // Update title jika ada nilai
    if (e.target?.product_name?.value) {
      updatedParams.title = e.target.product_name.value;
    } else {
      delete updatedParams.title;
    }

    // Update minPrice dan maxPrice jika ada nilai
    if (e.target?.min_price?.value) {
      updatedParams.minPrice = e.target.min_price.value;
    } else {
      delete updatedParams.minPrice;
    }

    if (e.target?.max_price?.value) {
      updatedParams.maxPrice = e.target.max_price.value;
    } else {
      delete updatedParams.maxPrice;
    }

    // Set semua perubahan dalam satu panggilan
    setSearchParams(updatedParams);

    navigate({
      pathname: "/", // Halaman utama
      search: `?${new URLSearchParams(updatedParams).toString()}`, // Menambahkan query params
    });
  };

  // Tutup filter saat klik di luar filterRef
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="relative flex items-center py-0 md:py-1.5">
        {/* Logo */}
        <div className="hidden md:inline-block relative z-10">
          <Link to="/">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 lg:w-24 h-auto object-contain"
            />
          </Link>
        </div>

        {/* Search */}
        <div className="flex justify-center relative md:absolute inset-0 w-full">
          <div ref={filterRef} className="static w-full md:w-auto">
            <div
              onClick={() => setShowFilter((prev) => !prev)}
              className="h-full flex justify-center items-center gap-x-3 pl-4 pr-6 py-2 md:py-0 border rounded-full shadow-md hover:bg-zinc-100 cursor-pointer transition active:scale-90 duration-300"
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
              <div className="absolute top-auto left-1/2 transform -translate-x-1/2 w-full md:w-9/12 lg:w-5/12 p-2 shadow-md rounded-2xl bg-zinc-100 z-[999] mt-2">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex flex-col gap-y-2"
                >
                  <div className="bg-white rounded-xl">
                    {/* Button show product filter */}
                    <div
                      className="sticky top-0 flex justify-between items-center py-3 px-4 cursor-pointer"
                      onClick={() => {
                        if (showPriceFilter) setShowPriceFilter(false);

                        setShowProductFilter((prev) => !prev);
                      }}
                    >
                      <p className="text-sm font-medium">Cari produk</p>

                      <div className="text-sm font-medium underline">
                        {!showProductFilter ? "Lihat" : "Sembunyikan"}
                      </div>
                    </div>

                    {/* Product filter */}
                    <ProductNameSearch showProductFilter={showProductFilter} />
                  </div>

                  <div className="bg-white rounded-xl">
                    {/* Button show price filter */}
                    <div
                      className="sticky top-0 flex justify-between items-center py-3 px-4 cursor-pointer"
                      onClick={() => {
                        if (showProductFilter) setShowProductFilter(false);

                        setShowPriceFilter((prev) => !prev);
                      }}
                    >
                      <p className="text-sm font-medium">Harga</p>

                      <div className="text-sm font-medium underline">
                        {!showPriceFilter ? "Lihat" : "Sembunyikan"}
                      </div>
                    </div>

                    {/* Price filter */}
                    <PriceFilter showPriceFilter={showPriceFilter} />
                  </div>

                  <div className="flex justify-end items-center mt-3">
                    <Button type="submit" buttonStyle="text-button">
                      Search
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePageHeader;
