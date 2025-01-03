import React, { useState } from "react";
import Input from "../Components/Input";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Loader from "../Components/Loader";

const AddExpense = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      price: "",
    },
    validationSchema: yup.object({
      name: yup.string().required("Nama pengeluaran harus diisi."),
      price: yup
        .number()
        .typeError("Tolong masukkan angka.")
        .required("Harga pengeluaran harus diisi."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      await axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/api/expense`, {
          name: values.name,
          price: values.price,
        })
        .then(({ data }) => {
          navigate("/admin/expense");
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
        Tambah pengeluaran
      </h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="flex flex-col gap-y-2">
          <Input
            id="name"
            name="name"
            type="text"
            label="Nama pengeluaran"
            placeholder="Masukkan nama pengeluaran"
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            errorMessage={formik.touched.name && formik.errors.name}
          />

          <Input
            id="price"
            name="price"
            type="text"
            label="Harga"
            placeholder="Masukkan harga pengeluaran"
            onChange={formik.handleChange("price")}
            onBlur={formik.handleBlur("price")}
            value={formik.values.price}
            errorMessage={formik.touched.price && formik.errors.price}
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

export default AddExpense;
