import React, { useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import DropdownSelect from "./DropdownSelect";
import { useSearchParams } from "react-router-dom";

const PriceFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [minPrice, setMinPrice] = useState(currentParams?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentParams?.maxPrice || "");

  return (
    <>
      <div className="flex flex-col gap-y-0.5 hover:bg-zinc-100 py-3 px-6 rounded-full cursor-pointer">
        <p className="text-xs font-semibold">Harga</p>

        <div className="flex items-center">
          <div className="flex items-center gap-x-2">
            <input
              type="text"
              name="min_price"
              className="w-20 outline-none text-sm"
              placeholder="Rp. Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>-</span>
            <input
              type="text"
              name="max_price"
              min="0"
              className="w-20 outline-none text-sm"
              placeholder="Rp. Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="ml-4 mr-7">
            <DropdownSelect
              id="price-filter"
              button={
                <button
                  type="button"
                  className="flex items-center gap-x-1 hover:bg-black/[.07] py-0.5 px-1 text-xs font-medium"
                >
                  Urutkan berdasarkan
                  <span>
                    <IoCaretDown />
                  </span>
                </button>
              }
              menuDirection="left"
              menuSize="small"
              selectMenu={[
                {
                  label: "Rendah ke tinggi",
                  value: "",
                },
                {
                  label: "Tinggi ke rendah",
                  value: "",
                },
              ]}
            ></DropdownSelect>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;