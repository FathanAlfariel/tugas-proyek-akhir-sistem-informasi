import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoCaretDown } from "react-icons/io5";
import DropdownSelect from "./DropdownSelect";

const HomePageHeader = () => {
  return (
    <>
      <header className="relative h-full mx-4 md:mx-6 mt-2.5 py-3 px-6">
        <img
          src="/logo.png"
          alt="logo"
          className="w-20 lg:w-24 h-auto object-contain"
        />

        <div className="absolute inset-0 w-full flex justify-center">
          <div className="w-auto flex items-center gap-x-4 py-3 pl-6 pr-2 border rounded-full">
            {/* Search by product name */}
            <div className="flex flex-col gap-y-0.5">
              <p className="text-xs font-semibold">Produk</p>
              <p className="text-sm text-[#606060]">
                Cari berdasarkan nama produk
              </p>
            </div>

            {/* Divider */}
            <div className="h-full w-px bg-[#CAC4D0]"></div>

            {/* Filter by price */}
            <div className="flex flex-col gap-y-0.5">
              <p className="text-xs font-semibold">Harga</p>

              <div className="flex items-center">
                <p className="text-sm text-[#606060]">Rp. Min - Rp. Max</p>

                <div className="ml-4 mr-7">
                  <DropdownSelect
                    id="price-filter"
                    button={
                      <button className="flex items-center gap-x-1 hover:bg-black/[.07] py-0.5 px-1 text-xs font-medium">
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

            <button className="p-3 text-2xl rounded-full transition-all active:scale-90 duration-300 bg-[#6750A4] shadow-none hover:shadow-md">
              <IoIosSearch className="text-white" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomePageHeader;
