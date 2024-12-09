import { useEffect, useState } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import Dropdown from "../Components/Dropdown";
import Button from "../Components/Button";
import Loader from "../Components/Loader";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { IoWarning } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const AddProductCreation = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [availableTailors, setAvailableTailors] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [estimation, setEstimation] = useState([]);

  // Mendapatkan tanggal saat ini dengan format yang sesuai
  const getDefaultDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Bulan mulai dari 0
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const getAvailableTailors = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/tailor`)
        .then(({ data }) => {
          setAvailableTailors(
            data.results.filter((item) => item.available === true)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAvailableTailors();
  }, []);

  useEffect(() => {
    const getMaterials = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/material`)
        .then(({ data }) => {
          setMaterials(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getMaterials();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      tailor: "",
      materials: [],
      startDate: getDefaultDateTime(),
      total: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Nama produk harus diisi."),
      tailor: yup.string().required("Penjahit harus diisi."),
      materials: yup
        .array()
        .of(
          yup.object({
            material: yup.string(),
            quantity: yup
              .number()
              .typeError("Tolong masukkan angka.")
              .required("Quantity bahan harus diisi."),
            size: yup
              .number()
              .typeError("Tolong masukkan angka.")
              .required("Ukuran bahan harus diisi"),
          })
        )
        .min(1, "Bahan harus diisi."),
      startDate: yup.string(),
      total: yup
        .number()
        .typeError("Tolong masukkan hanya angka.")
        .min(1, "Minimal 1 produk untuk dibuat")
        .required("Total produk harus diisi."),
    }),
    onSubmit: async (values) => {
      // setIsLoading(true);

      await axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/product-creation`, {
          name: values.name,
          tailor: values.tailor,
          materials: values.materials,
          startDate: values.startDate,
          estimationTime: estimation,
          total: values.total,
        })
        .then(({ data }) => {
          // console.log(data);
          navigate("/admin/product-creation");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  const estimate = async () => {
    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/estimate`, {
        materials: formik.values.materials.map((item) => ({
          material: item.material,
          quantity: parseInt(item.quantity),
          size: parseFloat(item.size),
        })),
        totalQuantity: parseInt(formik.values.total),
      })
      .then(({ data }) => {
        console.log(data);
        // Hitung jam, menit, dan detik
        const hours = Math.floor(data.data.total_estimated_hours / 60); // Total jam
        const minutes = Math.floor(data.data.total_estimated_hours % 60); // Sisa menit
        const seconds = Math.round((data.data.total_estimated_hours % 1) * 60); // Hitung detik dari desimal menit

        // Format ke "HH:MM:SS"
        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
          minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        setEstimation(formattedTime);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    estimate();
  }, [formik.values.materials, formik.values.total]);

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Tambah pembuatan produk
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-6">
          <div className="mb-5">
            <h5 className="text-lg font-medium mb-2.5">Informasi produk</h5>

            <div className="flex flex-col gap-y-2">
              <Input
                id="name"
                name="name"
                label="Nama produk"
                type="text"
                placeholder="Masukkan nama produk"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                errorMessage={formik.touched.name && formik.errors.name}
              />

              <Input
                id="total"
                name="total"
                label="Total produk"
                type="number"
                min={1}
                placeholder="Masukkan total produk yang akan dibuat"
                onChange={formik.handleChange("total")}
                onBlur={formik.handleBlur("total")}
                value={formik.values.total}
                errorMessage={formik.touched.total && formik.errors.total}
              />

              <Input
                id="startDate"
                name="startDate"
                label="Tanggal diproduksi"
                type="datetime-local"
                placeholder="Masukkan tanggal mulai produksi produk"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
                errorMessage={
                  formik.touched.startDate && formik.errors.startDate
                }
              />
            </div>
          </div>

          <div className="mb-5">
            <h5 className="text-lg font-medium mb-2.5">Pilih penjahit</h5>

            <Select
              id="tailor"
              label="Penjahit"
              placeholder="Pilih penjahit"
              selectMenu={availableTailors.map((item) => ({
                label: item?.name,
                value: item?.id,
              }))}
              onChange={(value) => {
                formik.setFieldValue("tailor", value);
              }}
              errorMessage={formik.touched.tailor && formik.errors.tailor}
            />
          </div>

          <div className="flex justify-between items-center mb-2.5">
            <h5 className="text-lg font-medium">Bahan-bahan</h5>

            <span
              title="Estimasi produk selesai dibuat"
              className="py-1.5 px-4 text-sm font-medium border rounded-full"
            >
              {estimation}
            </span>
          </div>
          <Dropdown
            id="add-materials"
            button={
              <Button type="button" buttonStyle="filled">
                Tambah bahan
              </Button>
            }
            selectMenu={materials.map((item) => ({
              label: item.name,
              handleMenuClicked: () =>
                formik.setFieldValue("materials", [
                  ...formik.values.materials,
                  {
                    id: item?.id,
                    material: item?.name,
                    quantity: 1,
                    size: 0,
                  },
                ]),
            }))}
          />
          <ul className="max-h-64 overflow-y-auto">
            {formik.values.materials.map((material, key) => {
              return (
                <li
                  key={key}
                  className="flex justify-between items-center py-4 border-b"
                >
                  <p className="text-sm">{material.material}</p>

                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-0.5">
                      <label
                        htmlFor={`materials[${key}].quantity`}
                        className="inline-flex items-center gap-x-1 text-xs font-medium"
                      >
                        Quantity
                        {formik.touched.materials?.[key]?.quantity &&
                        formik.errors.materials?.[key]?.quantity ? (
                          <span className="flex items-center before:content-['('] after:content-[')']">
                            <IoWarning className="text-xs text-red-600 dark:text-red-500" />
                            <p className="ml-1.5 text-xs text-red-600 dark:text-red-500">
                              {formik.touched.materials?.[key]?.quantity &&
                                formik.errors.materials?.[key]?.quantity}
                            </p>
                          </span>
                        ) : null}
                      </label>

                      <input
                        id={`materials[${key}].quantity`}
                        type="text"
                        name={`materials[${key}].quantity`}
                        className="outline-none border text-xs"
                        value={formik.values.materials[key].quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>

                    <div className="flex flex-col gap-y-0.5">
                      <label
                        htmlFor={`materials[${key}].size`}
                        className="inline-flex items-center gap-x-1 text-xs font-medium"
                      >
                        <span>
                          Size (cm<sup>2</sup>)
                        </span>
                        {formik.touched.materials?.[key]?.size &&
                        formik.errors.materials?.[key]?.size ? (
                          <span className="flex items-center before:content-['('] after:content-[')']">
                            <IoWarning className="text-xs text-red-600 dark:text-red-500" />
                            <p className="ml-1.5 text-xs text-red-600 dark:text-red-500">
                              {formik.touched.materials?.[key]?.size &&
                                formik.errors.materials?.[key]?.size}
                            </p>
                          </span>
                        ) : null}
                      </label>

                      <input
                        id={`materials[${key}].size`}
                        type="text"
                        name={`materials[${key}].size`}
                        className="outline-none border text-xs"
                        value={formik.values.materials[key].size}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
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
    </>
  );
};

export default AddProductCreation;
