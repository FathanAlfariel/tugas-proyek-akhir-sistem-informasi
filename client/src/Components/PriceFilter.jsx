import React, { useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import DropdownSelect from "./DropdownSelect";
import { useSearchParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

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
                  {currentParams?.sortPrice
                    ? currentParams?.sortPrice === "priceAsc"
                      ? "Rendah ke tinggi"
                      : "Tinggi ke rendah"
                    : "Urutkan berdasarkan"}

                  {currentParams?.sortPrice ? (
                    <span
                      title="Hapus filter harga"
                      className="p-0.5 rounded-full bg-black/[.1] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["sortPrice"];

                        setSearchParams(updatedParams);
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  ) : (
                    <span>
                      <IoCaretDown />
                    </span>
                  )}
                </button>
              }
              menuDirection="left"
              menuSize="small"
              selectMenu={[
                {
                  label: "Rendah ke tinggi",
                  value: "priceAsc",
                  handleMenuClicked: () =>
                    setSearchParams({
                      ...currentParams,
                      sortPrice: "priceAsc",
                    }),
                },
                {
                  label: "Tinggi ke rendah",
                  value: "priceDesc",
                  handleMenuClicked: () =>
                    setSearchParams({
                      ...currentParams,
                      sortPrice: "priceDesc",
                    }),
                },
              ]}
              defaultValue={currentParams?.sortPrice}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
