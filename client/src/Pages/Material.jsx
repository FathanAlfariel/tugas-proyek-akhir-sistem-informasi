import React, { useEffect, useState } from "react";
import Button from "../Components/Button";
import Modal from "../Components/Modal";
import Input from "../Components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Loader from "../Components/Loader";
import IconButton from "../Components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import EditMaterial from "./EditMaterial";

const Material = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState([]);

  const getAllMaterials = async () => {
    setIsLoading(true);

    await axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/material`)
      .then(({ data }) => {
        setMaterials(data.results);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getAllMaterials();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      complexity: "",
      cuttingTime: "",
      sewingTime: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Nama bahan harus diisi."),
      complexity: yup
        .number()
        .min(1.0, "Kompleksitas minimal 1.0")
        .max(2.0, "Kompleksitas maksimal 2.0")
        .test(
          "is-decimal",
          "Angka harus dalam bentuk desimal (contoh: 1.0, 1.1)",
          (value) => {
            if (!value) return false; // Pastikan nilai tidak kosong
            // Cek format desimal dengan regex
            return (
              /^\d+(\.\d+)?$/.test(value) &&
              parseFloat(value) >= 1.0 &&
              parseFloat(value) <= 2.0
            );
          }
        )
        .required("Kompleksitas bahan harus diisi."),
      cuttingTime: yup
        .number()
        .test("max-decimal", "Angka tidak boleh lebih dari 0.6", (value) => {
          if (value === undefined) return false; // Nilai kosong tidak valid
          const decimalPart = value % 1; // Bagian desimal
          return decimalPart < 0.7;
        })
        .required("Waktu pemotongan bahan harus diisi."),
      sewingTime: yup
        .number()
        .test("max-decimal", "Angka tidak boleh lebih dari 0.6", (value) => {
          if (value === undefined) return false; // Nilai kosong tidak valid
          const decimalPart = value % 1; // Bagian desimal
          return decimalPart < 0.7;
        })
        .required("Waktu penjahitan bahan harus diisi."),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);

      await axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/material`, {
          name: values.name,
          complexity: parseFloat(values.complexity),
          cuttingTime: parseFloat(values.cuttingTime),
          sewingTime: parseFloat(values.sewingTime),
        })
        .then(({ data }) => {
          getAllMaterials();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });

      resetForm();
    },
  });

  const handleDeleteMaterial = async (id) => {
    setIsLoading(true);

    await axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/material/${id}`)
      .then(({ data }) => {
        getAllMaterials();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleModalSubmit = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      formik.setTouched({
        name: true,
        complexity: true,
        cuttingTime: true,
        sewingTime: true,
      });
      return false; // Jangan tutup modal jika ada error
    }
    formik.handleSubmit(); // Jalankan submit jika validasi berhasil
    return true; // Tutup modal jika validasi berhasil
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="my-2.5">
        {/* Add material */}
        <Modal
          id="add-material"
          button={
            <Button type="button" buttonStyle="filled">
              Tambah bahan
            </Button>
          }
          headerTitle="Tambah bahan"
          onSubmit={handleModalSubmit}
        >
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-y-2.5"
          >
            <Input
              id="name"
              type="text"
              label="Nama bahan"
              placeholder="Masukkan nama bahan"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              errorMessage={formik.touched.name && formik.errors.name}
            />
            <Input
              id="complexity"
              type="number"
              label="Kompleksitas bahan"
              placeholder="Masukkan angka dari 1.0 - 2.0"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.complexity}
              errorMessage={
                formik.touched.complexity && formik.errors.complexity
              }
            />
            <Input
              id="cuttingTime"
              type="number"
              step="0.1"
              label="Waktu pemotongan"
              placeholder="Contoh: 1.0 (1 jam proses pemotongan) & 0.5 (0.5 jam proses pemotongan)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.cuttingTime}
              errorMessage={
                formik.touched.cuttingTime && formik.errors.cuttingTime
              }
            />
            <Input
              id="sewingTime"
              type="number"
              step="0.1"
              label="Waktu penjahitan"
              placeholder="Contoh: 1.0 (1 jam proses penjahitan) & 0.5 (0.5 jam proses penjahitan)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sewingTime}
              errorMessage={
                formik.touched.sewingTime && formik.errors.sewingTime
              }
            />
          </form>
        </Modal>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pl-0 md:pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Nama bahan
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Kompleksitas
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Tanggal
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {materials &&
              materials.map((material, key) => {
                return (
                  <tr key={key} className="border-b">
                    <td className="pl-0 md:pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm">{material?.name}</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm">{material?.complexity}</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <p className="text-xs">
                        {new Date(material?.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <p className="text-xs font-medium">Ditambahkan</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-x-1">
                        <EditMaterial
                          id={material?.id}
                          onUpdate={getAllMaterials}
                        />

                        <IconButton
                          type="button"
                          onClick={() => handleDeleteMaterial(material?.id)}
                          buttonType="icon"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {materials.length === 0 && (
        <div className="text-sm text-center py-6 text-[#606060]">
          Tidak ada data yang ditemukan
        </div>
      )}
    </>
  );
};

export default Material;
