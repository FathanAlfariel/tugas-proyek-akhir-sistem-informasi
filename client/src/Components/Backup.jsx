import React from "react";
import ProductNameSearch from "./ProductNameSearch";

const Backup = () => {
  return (
    <form
      onSubmit={handleSearchSubmit}
      className="hidden md:flex justify-center absolute inset-0 w-auto"
    >
      <div className="flex items-center gap-x-2 p-2 border rounded-full">
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
  );
};

export default Backup;
