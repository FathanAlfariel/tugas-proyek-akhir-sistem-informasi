import React from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import { useFormik } from "formik";
import * as yup from "yup";

const AddTailor = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      available: false,
    },
    validationSchema: yup.object({
      name: yup.string().required("Nama penjahit harus diisi."),
      available: yup.boolean().required("Status penjahit harus diisi."),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });
  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">
        Tambah penjahit
      </h1>

      <div className="flex flex-col gap-y-2">
        <Input
          id="name"
          name="name"
          type="text"
          label="Nama penjahit"
          placeholder="Masukkan nama penjahit"
        />

        <Select
          id="available"
          label="Status penjahit"
          placeholder="Masukkan status panjahit"
          selectMenu={[
            {
              label: "Ada",
              value: true,
            },
            {
              label: "Tidak ada",
              value: false,
            },
          ]}
        />
      </div>
    </>
  );
};

export default AddTailor;
