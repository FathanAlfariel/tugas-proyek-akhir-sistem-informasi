import React from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import axios from "axios";

const AddTailor = () => {
  const navigate = useNavigate();
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
      await axios
        .post("http://localhost:5000/api/tailor", {
          name: values.name,
          available: values.available,
        })
        .then(({ data }) => {
          navigate("/admin/tailor");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">
        Tambah penjahit
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nama penjahit"
            placeholder="Masukkan nama penjahit"
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            errorMessage={formik.touched.name && formik.errors.name}
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
            defaultValue={formik.values.available}
            onChange={(value) => {
              formik.setFieldValue("available", value);
            }}
            errorMessage={formik.touched.available && formik.errors.available}
          />
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

export default AddTailor;
