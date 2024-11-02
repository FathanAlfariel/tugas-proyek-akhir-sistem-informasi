import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { FiPlus } from "react-icons/fi";
import TextArea from "../Components/TextArea";

const AddProduct = () => {
  const [images, setImages] = useState([]);

  const uploadImages = async (e) => {
    const files = e.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    await axios
      .post("http://localhost:5000/api/product/images", data, {
        "Content-Type": "multipart/form-data",
      })
      .then(({ data }) => {
        setImages([...images, ...data.files]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
          <TextArea
            id="deskripsiProduk"
            name="deskripsiProduk"
            label="Deskripsi produk"
            placeholder="Masukkan deskripsi produk"
          />

          <div className="w-full py-2 px-3 border-2 rounded-xl">
            <h5 className="text-sm">Variasi</h5>

            <Button type="button" buttonStyle="filled">
              Tambah variasi
            </Button>
          </div>
        </div>

        <div className="col-span-5">
          <div className="flex">
            <div className="border-2 border-dashed rounded-xl">
              <label
                htmlFor="uploadImages"
                className="flex justify-center items-center p-6 cursor-pointer"
              >
                <input
                  id="uploadImages"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadImages}
                />
                <FiPlus className="text-lg" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
