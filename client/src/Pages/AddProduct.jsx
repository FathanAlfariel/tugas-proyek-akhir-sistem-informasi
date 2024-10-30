import React from "react";
import Input from "../Components/Input";
import { FiPlus } from "react-icons/fi";
import TextArea from "../Components/TextArea";

const AddProduct = () => {
  return (
    <>
      <div className="grid grid-cols-12 gap-x-6">
        <div className="col-span-7">
          <Input
            id="namaProduk"
            name="namaProduk"
            type="text"
            label="Nama produk"
            placeholder="Masukkan nama produk"
          />
          {/* <Input
            id="deskripsiProduk"
            name="deskripsiProduk"
            type="text"
            label="Deskripsi produk"
            placeholder="Masukkan deskripsi produk"
          /> */}
          <TextArea
            id="deskripsiProduk"
            name="deskripsiProduk"
            label="Deskripsi produk"
            placeholder="Masukkan deskripsi produk"
          />
        </div>

        <div className="col-span-5">
          <div className="flex">
            <div className="border-2 border-dashed rounded-xl">
              <label
                htmlFor="uploadImage"
                className="flex justify-center items-center p-8"
              >
                <input
                  id="uploadImage"
                  type="file"
                  multiple
                  className="hidden"
                />
                <FiPlus />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
