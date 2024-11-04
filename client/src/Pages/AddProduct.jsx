import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { FiPlus } from "react-icons/fi";
import TextArea from "../Components/TextArea";
import { IoWarning } from "react-icons/io5";

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
        for (let i = 0; i < data.files?.length; i++) {
          formik.setFieldValue("images", [
            ...formik.values.images,
            data.files[i].filename,
          ]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const formik = useFormik({
    initialValues: {
      images: [],
      name: "",
      description: "",
      variants: [],
    },
    validationSchema: yup.object({
      images: yup
        .array()
        .of(yup.string().required("Gambar harus diisi."))
        .min(1, "Gambar harus diisi."),
      name: yup.string().required("Nama produk harus diisi."),
      description: yup.string().required("Nama produk harus diisi."),
      variants: yup.array().of(
        yup.object({
          color: yup.string().required("Warna harus diisi."),
          size: yup.object({
            length: yup.number().required("Panjang produk harus diisi."),
            width: yup.number().required("Lebar produk harus diisi."),
            height: yup.number().required("Tinggi produk harus diisi."),
            stock: yup.number().required("Stok varian produk harus diisi."),
            price: yup.number().required("Harga varian produk harus diisi."),
          }),
        })
      ),
    }),
    onSubmit: async (values) => {
      await axios
        .post("http://localhost:5000/api/product", {
          images: images,
          name: values.name,
          description: values.description,
          variants: values.variants,
        })
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  const handleAddvariants = () => {
    formik.setFieldValue("variants", [
      ...formik.values.variants,
      {
        color: "",
        size: {
          length: "",
          width: "",
          height: "",
          stock: "",
          price: "",
        },
      },
    ]);
  };

  const deletevariants = (key) => {
    const value = formik.values.variants;
    value.splice(key, 1);

    formik.setFieldValue("variants", value);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-7">
            <Input
              id="namaProduk"
              name="namaProduk"
              type="text"
              label="Nama produk"
              placeholder="Masukkan nama produk"
              onChange={formik.handleChange("name")}
              onBlur={formik.handleBlur("name")}
              value={formik.values.name}
              errorMessage={formik.touched.name && formik.errors.name}
            />
            <TextArea
              id="deskripsiProduk"
              name="deskripsiProduk"
              label="Deskripsi produk"
              placeholder="Masukkan deskripsi produk"
              onChange={formik.handleChange("description")}
              onBlur={formik.handleBlur("description")}
              value={formik.values.description}
              errorMessage={
                formik.touched.description && formik.errors.description
              }
            />

            <div className="w-full py-2 px-3 border-2 rounded-xl">
              <h5 className="text-sm">Variasi</h5>

              {/* variants */}
              {formik.values.variants.map((_, key) => {
                return (
                  <div
                    key={key}
                    className="border-2 border-dashed rounded-lg p-4 my-3"
                  >
                    <button type="button" onClick={() => deletevariants(key)}>
                      X
                    </button>
                    <Input
                      id={`warna-[${key}]`}
                      name={`variants[${key}].color`}
                      type="text"
                      label="Warna produk"
                      placeholder="Masukkan warna produk"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.variants[key].color}
                      errorMessage={
                        formik.touched.variants?.[key]?.color &&
                        formik.errors.variants?.[key]?.color
                      }
                    />

                    <div className="mt-4">
                      <h5 className="text-sm">Ukuran</h5>
                      <div className="grid grid-cols-3 gap-x-4 mt-2">
                        <Input
                          id={`panjang-${key}`}
                          name={`variants[${key}].size.length`}
                          type="text"
                          label="Panjang produk"
                          placeholder="Masukkan panjang produk"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.variants[key].size.length}
                          errorMessage={
                            formik.touched.variants?.[key]?.size?.length &&
                            formik.errors.variants?.[key]?.size?.length
                          }
                        />
                        <Input
                          id={`lebar-${key}`}
                          name={`variants[${key}].size.width`}
                          type="text"
                          label="Lebar produk"
                          placeholder="Masukkan lebar produk"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.variants[key].size.width}
                          errorMessage={
                            formik.touched.variants?.[key]?.size?.width &&
                            formik.errors.variants?.[key]?.size?.width
                          }
                        />
                        <Input
                          id={`tinggi-${key}`}
                          name={`variants[${key}].size.height`}
                          type="text"
                          label="Tinggi produk"
                          placeholder="Masukkan tinggi produk"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.variants[key].size.height}
                          errorMessage={
                            formik.touched.variants?.[key]?.size?.height &&
                            formik.errors.variants?.[key]?.size?.height
                          }
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <h5 className="text-sm">Stok & Harga</h5>
                      <div className="grid grid-cols-2 gap-x-4 mt-2">
                        <Input
                          id={`stok-${key}`}
                          name={`variants[${key}].size.stock`}
                          type="text"
                          label="Stok produk"
                          placeholder="Masukkan stok produk"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.variants[key].size.stock}
                          errorMessage={
                            formik.touched.variants?.[key]?.size?.stock &&
                            formik.errors.variants?.[key]?.size?.stock
                          }
                        />
                        <Input
                          id={`harga-${key}`}
                          name={`variants[${key}].size.price`}
                          type="text"
                          label="Harga produk"
                          placeholder="Masukkan harga produk"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.variants[key].size.price}
                          errorMessage={
                            formik.touched.variants?.[key]?.size?.price &&
                            formik.errors.variants?.[key]?.size?.price
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="mt-5">
                <Button
                  type="button"
                  buttonStyle="filled"
                  onClick={handleAddvariants}
                  width="full"
                >
                  Tambah variasi
                </Button>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="col-span-5">
            <h5 className="text-lg font-medium">Tambah gambar</h5>

            <ul className="flex items-center gap-x-2 mt-4">
              {formik.values.images &&
                formik.values.images.map((name, key) => {
                  return (
                    <li key={key}>
                      <img
                        src={`http://localhost:5000/public/images/${name}`}
                        alt={name}
                        className="h-[70px] w-[70px] object-cover rounded-xl"
                      />
                    </li>
                  );
                })}
              <li>
                {/* Add Images */}
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
              </li>
            </ul>

            {formik.touched.images && formik.errors.images && (
              <>
                <div className="flex items-center mt-2">
                  <IoWarning className="text-xs text-red-600 dark:text-red-500" />
                  <p className="ml-1.5 text-xs text-red-600 dark:text-red-500">
                    {formik.errors.images}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <button type="button">Cancel</button>
          <Button type="submit" buttonStyle="filled">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;