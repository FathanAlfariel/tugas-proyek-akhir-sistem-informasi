import React, { useEffect, useState } from "react";
import Input from "../Components/Input";
import IconButton from "../Components/IconButton";
import { HiOutlinePencil } from "react-icons/hi2";
import Modal from "../Components/Modal";
import Loader from "../Components/Loader";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const EditMaterial = ({ id, onUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const getMaterialById = async () => {
      await axios
        .get(`http://localhost:5000/api/material/${id}`)
        .then(({ data }) => {
          formik.setFieldValue("name", data?.results?.name);
          formik.setFieldValue("complexity", data?.results?.complexity);
          formik.setFieldValue("cuttingTime", data?.results?.cuttingTime);
          formik.setFieldValue("sewingTime", data?.results?.sewingTime);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getMaterialById();
  }, [id]);

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
        .test("is-decimal", "Angka harus dalam bentuk desimal", (value) =>
          (value + "").match(/^\d*\.{1}\d*$/)
        )
        .min(1.0, "Kompleksitas minimal 1.0")
        .max(2.0, "Kompleksitas maksimal 2.0")
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
    onSubmit: async (values) => {
      setIsLoading(true);

      await axios
        .put(`http://localhost:5000/api/material/${id}`, {
          name: values.name,
          complexity: parseFloat(values.complexity),
          cuttingTime: parseFloat(values.cuttingTime),
          sewingTime: parseFloat(values.sewingTime),
        })
        .then(({ data }) => {
          if (onUpdate) onUpdate();
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

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

      {/* Edit material */}
      <Modal
        id={"edit-material" + id}
        button={
          <IconButton type="button" buttonType="icon">
            <HiOutlinePencil className="text-lg" />
          </IconButton>
        }
        headerTitle="Edit bahan"
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
            errorMessage={formik.touched.complexity && formik.errors.complexity}
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
            errorMessage={formik.touched.sewingTime && formik.errors.sewingTime}
          />
        </form>
      </Modal>
    </>
  );
};

export default EditMaterial;
