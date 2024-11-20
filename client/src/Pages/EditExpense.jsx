import React, { useEffect } from "react";
import Input from "../Components/Input";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../Components/Button";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";

const AddExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getExpenseDataById = async () => {
      await axios
        .get(`http://localhost:5000/api/expense/${id}`)
        .then(({ data }) => {
          formik.setFieldValue("name", data.results.name);
          formik.setFieldValue("price", data.results.price);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getExpenseDataById();
  }, [id]);

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
      await axios
        .put(`http://localhost:5000/api/expense/${id}`, {
          name: values.name,
          price: values.price,
        })
        .then(({ data }) => {
          navigate("/admin/expense");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">
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
