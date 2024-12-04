import React, { useEffect, useState } from "react";
import { IoCaretDown } from "react-icons/io5";
import DropdownSelect from "./DropdownSelect";
import Input from "./Input";
import { useSearchParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import Button from "./Button";

const PriceFilter = ({ showPriceFilter }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortPrice, setSortPrice] = useState("");

  useEffect(() => {
    setMinPrice(currentParams?.minPrice);
  }, [searchParams]);

  useEffect(() => {
    setMaxPrice(currentParams?.maxPrice);
  }, [searchParams]);

  useEffect(() => {
    setSortPrice(currentParams?.sortPrice);
  }, [searchParams]);

  console.log(sortPrice);

  return (
    <>
      {showPriceFilter && (
        <div className="mt-1 px-4 pb-3">
          <div className="flex items-center gap-x-2">
            <div className="w-full">
              <Input
                type="text"
                name="min_price"
                placeholder="Rp. Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <span>-</span>
            <div className="w-full">
              <Input
                type="text"
                name="max_price"
                min="0"
                placeholder="Rp. Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <DropdownSelect
              id="price-filter"
              button={
                <Button
                  type="button"
                  buttonStyle="text-button"
                  className="flex items-center gap-x-2 text-xs"
                >
                  {sortPrice
                    ? sortPrice === "priceAsc"
                      ? "Rendah ke tinggi"
                      : "Tinggi ke rendah"
                    : "Urutkan berdasarkan"}

                  {currentParams?.sortPrice ? (
                    <span
                      title="Hapus filter harga"
                      className="p-0.5 rounded-full bg-black/[.1]"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = {
                          ...currentParams,
                        };
                        delete updatedParams["sortPrice"];

                        setSearchParams(updatedParams);
                        setSortPrice("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  ) : (
                    <span>
                      <IoCaretDown />
                    </span>
                  )}
                </Button>
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
              defaultValue={sortPrice}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PriceFilter;
