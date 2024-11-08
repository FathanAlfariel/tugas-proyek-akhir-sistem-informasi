import React from "react";
import Input from "../Components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import AddProductOrder from "../Components/AddProductOrder";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import { IoWarning } from "react-icons/io5";

const AddOrder = () => {
  const formik = useFormik({
    initialValues: {
      shippingReceipt: "",
      productId: [],
      name: "",
      phone: "",
      address: {},
    },
    validationSchema: yup.object({
      shippingReceipt: yup.string().required("Resi pemesanan harus diisi."),
      productId: yup
        .array()
        .of(
          yup.object({
            product: yup.string(),
            variants: yup.array().of(
              yup.object({
                variantId: yup.string(),
                total: yup.number().typeError("Tolong masukkan hanya angka."),
              })
            ),
          })
        )
        .min(1, "Produk pesanan harus diisi."),
      name: yup.string().required("Nama pemesan harus diisi."),
      phone: yup
        .number()
        .typeError("Tolong masukkan hanya angka.")
        .required("Nomor telepon pemesan harus diisi."),
      address: yup.object({
        city: yup.string().required("Kota harus diisi."),
        province: yup.string().required("Provinsi harus diisi."),
        district: yup.string().required("Kecamatan harus diisi."),
        postalCode: yup.string().required("Kode pos harus diisi."),
        country: yup.string().required("Negara harus diisi."),
      }),
    }),
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">Tambah pesanan</h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-7">
            {/* Informasi pemesan */}
            <div>
              <h5 className="text-lg font-medium mb-2.5">Informasi pemesan</h5>

              <div className="flex flex-col gap-y-2">
                <Input
                  id="name"
                  type="text"
                  name="name"
                  label="Nama pemesan"
                  placeholder="Masukkan nama pemesan"
                  onChange={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                  value={formik.values.name}
                  errorMessage={formik.touched.name && formik.errors.name}
                />

                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  label="Nomor telepon pemesan"
                  placeholder="Masukkan nomor telepon pemesan"
                  onChange={formik.handleChange("phone")}
                  onBlur={formik.handleBlur("phone")}
                  value={formik.values.phone}
                  errorMessage={formik.touched.phone && formik.errors.phone}
                />
              </div>
            </div>
          </div>

          <div className="col-span-5">
            {/* Produk yang dipesan */}
            <AddProductOrder formik={formik} />

            {formik.touched.productId && formik.errors.productId && (
              <div className="flex items-center mt-1.5">
                <IoWarning className="text-xs text-red-600 dark:text-red-500" />
                <p className="ml-1.5 text-xs text-red-600 dark:text-red-500">
                  {formik.errors.productId}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 right-0 flex justify-end items-center gap-x-2 mt-8 mx-6 py-8">
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

export default AddOrder;
