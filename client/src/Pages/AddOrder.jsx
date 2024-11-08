import React from "react";
import Input from "../Components/Input";
import { FiPlus } from "react-icons/fi";

const AddOrder = () => {
  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">Tambah pesanan</h1>

      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-7">
          {/* Informasi pemesan */}
          <div>
            <h5 className="text-lg font-medium mb-2.5">Informasi pemesan</h5>

            <div className="flex flex-col gap-y-2">
              <Input
                id="name"
                type="text"
                name="name"
                label="Nama pemesan"
                placeholder="Masukkan nama pemesan"
              />

              <Input
                id="phone"
                type="text"
                name="phone"
                label="Nomor telepon pemesan"
                placeholder="Masukkan nomor telepon pemesan"
              />
            </div>
          </div>
        </div>

        <div className="col-span-5">
          {/* Produk yang dipesan */}
          <h5 className="text-lg font-medium mb-2.5">Produk yang dipesan</h5>

          <div>
            <button className="flex justify-center items-center w-full p-5 border-2 border-dashed rounded-xl transition-all active:scale-90 duration-300">
              <FiPlus className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOrder;
