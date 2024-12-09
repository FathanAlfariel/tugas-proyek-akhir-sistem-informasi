import React, { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { FiPlus } from "react-icons/fi";
import TextArea from "../Components/TextArea";
import { IoEyeOutline, IoWarning } from "react-icons/io5";
import { useParams, useNavigate, Link } from "react-router-dom";
import IconButton from "../Components/IconButton";
import { MdClose } from "react-icons/md";
import { HiOutlineTrash } from "react-icons/hi2";
import ViewImages from "../Components/ViewImages";
import Loader from "../Components/Loader";
import AddVariant from "../Components/AddVariant";
import EditVariant from "../Components/EditVariant";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [viewImageFilename, setViewImageFilename] = useState(null);

  const [variants, setVariants] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const fetchProductData = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`)
        .then(({ data }) => {
          formik.setFieldValue(
            "images",
            data.results.images.map((image) => ({
              id: image.id,
              name: image.name,
            }))
          );
          formik.setFieldValue("name", data.results.name);
          formik.setFieldValue("description", data.results.description);
          setVariants(
            data.results.variants.map((variant) => ({
              id: variant.id,
              color: variant.color,
              size: {
                length: variant.length,
                width: variant.width,
                height: variant.height,
                stock: variant.stock,
                price: variant.price,
              },
            }))
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchProductData();
  }, [id]);

  const uploadImages = async (e) => {
    const files = e.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    setIsLoading(true);

    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/product/images`, data, {
        "Content-Type": "multipart/form-data",
      })
      .then(({ data }) => {
        const imagesName = [];
        for (const file of data.files) {
          imagesName.push({ name: file.filename });
        }
        formik.setFieldValue("images", [
          ...formik.values.images,
          ...imagesName,
        ]);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      images: [],
      name: "",
      description: "",
    },
    validationSchema: yup.object({
      images: yup.array().min(1, "Gambar harus diisi."),
      name: yup.string().required("Nama produk harus diisi."),
      description: yup.string().required("Nama produk harus diisi."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      await axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`, {
          images: values.images,
          name: values.name,
          description: values.description,
          variants: variants,
        })
        .then(({ data }) => {
          navigate("/admin/product");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Edit produk
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-x-6 ">
          <div className="col-span-12 md:col-span-7 flex flex-col gap-y-4 mt-4 md:mt-0">
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

            {/* Variant */}
            <div className="w-full px-3 border-2 rounded-xl">
              <div className="sticky top-0 flex justify-between items-center py-2">
                <h5 className="text-sm">Variant</h5>

                <AddVariant setVariants={setVariants} />
              </div>

              <ul
                className={`grid grid-cols-2 gap-2 md:flex items-center flex-wrap md:gap-4 ${
                  variants.length > 0 && "pb-3"
                }`}
              >
                {variants?.map((variant, key) => {
                  return (
                    <li
                      key={key}
                      className="flex items-center gap-x-4 pl-4 pr-1 py-1 border rounded-xl"
                    >
                      <div className="overflow-x-auto">
                        <p className="text-nowrap text-xs font-medium ">
                          {variant?.color}: {variant?.size?.length}cm x{" "}
                          {variant?.size?.width}
                          cm x {variant?.size?.height}cm
                        </p>
                        <p className="text-xs text-nowrap">
                          Harga:{" "}
                          {variant?.size?.price?.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </p>
                        <p className="text-xs">Stok: {variant?.size?.stock}</p>
                      </div>

                      <div className="flex flex-col">
                        <EditVariant
                          index={key}
                          variants={variants}
                          setVariants={setVariants}
                        />

                        <IconButton
                          type="button"
                          buttonType="icon"
                          onClick={() => {
                            const newData = variants.filter(
                              (item, index) => index !== key
                            );

                            setVariants(newData);
                          }}
                        >
                          <HiOutlineTrash className="text-sm" />
                        </IconButton>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Images */}
          <div className="col-span-12 md:col-span-5 order-first md:order-last flex flex-col justify-between">
            <div>
              <h5 className="text-lg font-medium">Tambah gambar</h5>

              <div className="max-h-40 md:max-h-0 overflow-y-auto md:overflow-visible">
                <ul className="flex flex-wrap items-center gap-2 mt-4">
                  {formik.values.images &&
                    formik.values.images.map((image, key) => {
                      return (
                        <li key={key} className="shrink-0 relative">
                          <img
                            src={`${
                              import.meta.env.VITE_API_BASE_URL
                            }/public/images/${image.name}`}
                            alt={image.name}
                            className="h-20 w-20 object-cover rounded-xl"
                          />

                          {/* View and delete image */}
                          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/[0.5] rounded-xl">
                            {/* View image */}
                            <IconButton
                              buttonType="icon"
                              type="button"
                              onClick={() => setViewImageFilename(image.name)}
                            >
                              <IoEyeOutline className="text-white text-lg" />
                            </IconButton>

                            {/* Delete image */}
                            <IconButton
                              buttonType="icon"
                              type="button"
                              onClick={() => {
                                formik.setFieldValue(
                                  "images",
                                  formik.values.images.filter(
                                    (item) => item.name !== image.name
                                  )
                                );
                              }}
                            >
                              <HiOutlineTrash className="text-white text-lg" />
                            </IconButton>
                          </div>
                        </li>
                      );
                    })}
                  <li>
                    {/* Add Images */}
                    <div className="border-2 border-dashed rounded-xl">
                      <label
                        htmlFor="uploadImages"
                        className="flex justify-center items-center p-7 cursor-pointer"
                      >
                        <input
                          id="uploadImages"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={uploadImages}
                        />
                        <FiPlus className="text-xl" />
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

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
        </div>

        <div className="block md:fixed bottom-0 right-0 flex justify-end items-center gap-x-2 mt-8 mx-0 md:mx-6 py-0 md:py-8">
          <Link to={-1}>
            <Button type="button" buttonStyle="text-button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" buttonStyle="filled">
            Submit
          </Button>
        </div>
      </form>

      {viewImageFilename && (
        <ViewImages
          filename={viewImageFilename}
          onClose={() => setViewImageFilename(null)}
        />
      )}
    </>
  );
};

export default EditProduct;
