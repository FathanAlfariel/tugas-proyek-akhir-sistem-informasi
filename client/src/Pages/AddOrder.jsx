import React, { useEffect, useState } from "react";
import Input from "../Components/Input";
import { useFormik } from "formik";
import * as yup from "yup";
import AddProductOrder from "../Components/AddProductOrder";
import { Link } from "react-router-dom";
import Button from "../Components/Button";
import Select from "../Components/Select";
import { IoWarning } from "react-icons/io5";
import axios from "axios";

const AddOrder = () => {
  const [productsOrderList, setProductsOrderList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [states, setStates] = useState([]);

  const formik = useFormik({
    initialValues: {
      shippingReceipt: "",
      variantId: [],
      name: "",
      phone: "",
      address: {},
    },
    validationSchema: yup.object({
      shippingReceipt: yup.string().required("Resi pemesanan harus diisi."),
      variantId: yup.array().of(
        yup.object({
          id: yup.string(),
          total: yup
            .number()
            .typeError("Tolong masukkan angka.")
            .required("Total harus diisi.")
            .min(1, "Total minimal adalah 1.")
            .max(100, "Total maksimal adalah 100."),
        })
      ),
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

  useEffect(() => {
    const getProductsOrderList = async () => {
      await axios
        .post("http://localhost:5000/api/product/variant", {
          data: formik.values.variantId,
        })
        .then(({ data }) => {
          setProductsOrderList(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getProductsOrderList();
  }, [formik.values.variantId]);

  // Function to display an alert when the user wants to leave or refresh the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      const message =
        "Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin meninggalkan halaman ini?";
      event.returnValue = message; // Displays a confirmation dialog on most browsers
      return message;
    };

    // Added 'beforeunload' event listener
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup: Removes event listener when component is unmounted
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Get all countries
  useEffect(() => {
    const getCountries = async () => {
      await axios
        .get("http://localhost:5000/api/country")
        .then(({ data }) => {
          setCountries(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getCountries();
  }, []);

  // Get state by selected country
  useEffect(() => {
    const getStates = async () => {
      await axios
        .get(`http://localhost:5000/api/country/state?state=${selectedCountry}`)
        .then(({ data }) => {
          setStates(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getStates();
  }, [selectedCountry]);

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">Tambah pesanan</h1>

      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-12 gap-x-6">
          <div className="col-span-7">
            {/* Informasi pemesan */}
            <div className="mb-6">
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

            {/* Ongkir dan diskon pesanan */}
            <div className="mb-6">
              <h5 className="text-lg font-medium mb-2.5">
                Ongkir dan discount
              </h5>

              <div className="flex flex-col gap-y-2">
                <Input
                  id="ongkir"
                  type="text"
                  name="ongkir"
                  label="Ongkir"
                  placeholder="Masukkan ongkir"
                  onChange={formik.handleChange("ongkir")}
                  onBlur={formik.handleBlur("ongkir")}
                  value={formik.values.ongkir}
                  errorMessage={formik.touched.ongkir && formik.errors.ongkir}
                />

                <Input
                  id="discount"
                  type="text"
                  name="discount"
                  label="Discount"
                  placeholder="Masukkan discount"
                  onChange={formik.handleChange("discount")}
                  onBlur={formik.handleBlur("discount")}
                  value={formik.values.discount}
                  errorMessage={
                    formik.touched.discount && formik.errors.discount
                  }
                />
              </div>
            </div>

            {/* Alamat pengiriman */}
            <div>
              <h5 className="text-lg font-medium mb-2.5">Alamat pengiriman</h5>

              <div className="flex flex-col gap-y-2">
                {/* Country selection */}
                <Select
                  id="country"
                  label="Negara"
                  placeholder="Pilih negara"
                  selectMenu={countries}
                  setSelectMenu={setCountries}
                  showSearch={true}
                  value={(value) => setSelectedCountry(value)}
                />
                <Input
                  id="alamat"
                  type="text"
                  name="alamat"
                  label="Alamat"
                  placeholder="Nama jalan, gedung, no. rumah"
                  onChange={formik.handleChange("alamat")}
                  onBlur={formik.handleBlur("alamat")}
                  value={formik.values.alamat}
                  errorMessage={formik.touched.alamat && formik.errors.alamat}
                />
                <Input
                  id="detail"
                  type="text"
                  name="detail"
                  label="Detail lainnya"
                  placeholder="Blok / Unit no. patokan"
                  onChange={formik.handleChange("detail")}
                  onBlur={formik.handleBlur("detail")}
                  value={formik.values.detail}
                  errorMessage={formik.touched.detail && formik.errors.detail}
                />

                {/* State selection */}
                <Select
                  id="province"
                  label="Negara Bagian / Provinsi / Wilayah"
                  placeholder="Pilih negara bagian / provinsi / wilayah"
                  selectMenu={states}
                  setSelectMenu={setStates}
                  showSearch={true}
                  disabled={selectedCountry === "" ? true : false}
                />

                <div className="flex items-center gap-x-2">
                  <div className="w-full">
                    {/* City selection */}
                    <Select
                      id="city"
                      label="Kota"
                      placeholder="Pilih kota"
                      selectMenu={states}
                      setSelectMenu={setStates}
                      showSearch={true}
                      // disabled={selectedCountry === "" ? true : false}
                    />
                  </div>

                  <div className="w-full">
                    {/* Postal code */}
                    <Input
                      id="postal_code"
                      type="text"
                      name="postal_code"
                      label="Kode pos"
                      placeholder="Masukkan kode pos"
                      onChange={formik.handleChange("postal_code")}
                      onBlur={formik.handleBlur("postal_code")}
                      value={formik.values.postal_code}
                      errorMessage={
                        formik.touched.postal_code && formik.errors.postal_code
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-5">
            {/* Produk yang dipesan */}
            <AddProductOrder
              formik={formik}
              productsOrderList={productsOrderList}
            />

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

        <div className="sticky bottom-0 right-0 w-full flex justify-end items-center gap-x-2 mx-6 py-8">
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
