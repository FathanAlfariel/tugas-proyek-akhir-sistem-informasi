import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCaretDown } from "react-icons/io5";
import DropdownSelect from "./DropdownSelect";
import ProductNameSearch from "./ProductNameSearch";
import { useSearchParams } from "react-router-dom";
import PriceFilter from "./PriceFilter";

const HomePageHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    // Buat salinan dari parameter saat ini
    const updatedParams = { ...currentParams };

    // Update title jika ada nilai
    if (e.target.product_name.value !== "") {
      updatedParams.title = e.target.product_name.value;
    } else {
      delete updatedParams.title;
    }

    // Update minPrice dan maxPrice jika ada nilai
    if (e.target.min_price.value) {
      updatedParams.minPrice = e.target.min_price.value;
    } else {
      delete updatedParams.minPrice;
    }

    if (e.target.max_price.value) {
      updatedParams.maxPrice = e.target.max_price.value;
    } else {
      delete updatedParams.maxPrice;
    }

    // Set semua perubahan dalam satu panggilan
    setSearchParams(updatedParams);
  };

  return (
    <>
      <header className="relative h-full mx-4 md:mx-6 mt-4 py-4">
        <img
          src="/logo.png"
          alt="logo"
          className="w-20 lg:w-24 h-auto object-contain"
        />

        <form
          onSubmit={handleSearchSubmit}
          className="absolute inset-0 w-full flex justify-center"
        >
          <div className="flex items-center gap-x-2 p-1.5 border rounded-full">
            {/* Search by product name */}
            <ProductNameSearch />

            {/* Divider */}
            <div className="h-full w-px bg-[#CAC4D0]"></div>

            {/* Filter by price */}
            <PriceFilter />

            <button
              type="submit"
              className="p-3 text-2xl rounded-full transition-all active:scale-90 duration-300 bg-[#6750A4] shadow-none hover:shadow-md"
            >
              <IoIosSearch className="text-white" />
            </button>
          </div>
        </form>
      </header>
    </>
  );
};

export default HomePageHeader;
