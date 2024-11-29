import { useEffect, useState } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import Dropdown from "../Components/Dropdown";
import Button from "../Components/Button";
import axios from "axios";
import { FiPlus } from "react-icons/fi";
import { useFormik } from "formik";
import * as yup from "yup";
import { IoWarning } from "react-icons/io5";

const AddProductCreation = () => {
  const [availableTailors, setAvailableTailors] = useState([]);
  const [materials, setMaterials] = useState([]);

  const [estimation, setEstimation] = useState([]);

  useEffect(() => {
    const getAvailableTailors = async () => {
      await axios
        .get("http://localhost:5000/api/tailor")
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
        .get("http://localhost:5000/api/material")
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
      materials: [],
      size: "",
      additional_features: "",
    },
    validationSchema: yup.object({
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
      size: yup.string(),
      additional_features: yup.string(),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const estimate = async () => {
    await axios
      .post("http://localhost:5000/api/estimate", {
        materials: formik.values.materials.map((item) => ({
          material: item.material,
          quantity: parseInt(item.quantity),
          size: parseFloat(item.size),
        })),
        totalQuantity: 10,
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
  }, [formik.values.materials]);

  console.log(formik.values.materials);

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">
        Tambah pembuatan produk
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-6">
        <div>
          <h5 className="text-lg font-medium mb-2.5">Informasi produk</h5>

          <Input
            id="name"
            label="Nama produk"
            type="text"
            name="name"
            placeholder="Masukkan nama produk"
          />
        </div>

        <div>
          <div className="mb-5">
            <h5 className="text-lg font-medium mb-2.5">Pilih penjahit</h5>

            <Select
              id="tailor"
              label="Penjahit"
              placeholder="Pilih penjahit"
              selectMenu={availableTailors.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </div>

          <div>
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
                      material: item.name,
                      quantity: 1,
                      size: 0,
                    },
                  ]),
              }))}
            />
            <ul>
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
        </div>
      </div>
    </>
  );
};

export default AddProductCreation;
