import React from "react";
import Input from "./Input";
import { useFormik } from "formik";
import * as yup from "yup";
import Modal from "./Modal";
import Button from "./Button";

const AddVariant = ({ setVariants }) => {
  const variantFormik = useFormik({
    initialValues: {
      color: "",
      size: {
        length: "",
        width: "",
        height: "",
        stock: "",
        price: "",
      },
    },
    validationSchema: yup.object({
      color: yup.string().required("Warna harus diisi."),
      size: yup.object({
        length: yup.number().required("Panjang produk harus diisi."),
        width: yup.number().required("Lebar produk harus diisi."),
        height: yup.number().required("Tinggi produk harus diisi."),
        stock: yup.number().required("Stok varian produk harus diisi."),
        price: yup.number().required("Harga varian produk harus diisi."),
      }),
    }),
    onSubmit: (values, { resetForm }) => {
      setVariants((prev) => [
        ...prev,
        {
          color: values.color,
          size: {
            length: parseFloat(values.size.length),
            width: parseFloat(values.size.width),
            height: parseFloat(values.size.height),
            stock: parseInt(values.size.stock),
            price: parseInt(values.size.price),
          },
        },
      ]);

      resetForm(); // Reset form setelah submit berhasil
    },
  });

  const handleModalSubmit = async () => {
    const errors = await variantFormik.validateForm();
    if (Object.keys(errors).length > 0) {
      variantFormik.setTouched({
        color: true,
        size: {
          length: true,
          width: true,
          height: true,
          stock: true,
          price: true,
        },
      });
      return false; // Jangan tutup modal jika ada error
    }
    variantFormik.handleSubmit(); // Jalankan submit jika validasi berhasil
    return true; // Tutup modal jika validasi berhasil
  };

  return (
    <>
      <Modal
        id="add-variant"
        button={
          <Button type="button" buttonStyle="filled">
            Tambah variant
          </Button>
        }
        headerTitle="Tambah variant"
        onSubmit={handleModalSubmit}
      >
        <>
          <Input
            id="color"
            name={`color`}
            type="text"
            label="Warna produk"
            placeholder="Masukkan warna produk"
            onChange={variantFormik.handleChange}
            onBlur={variantFormik.handleBlur}
            value={variantFormik.values.color}
            errorMessage={
              variantFormik.touched?.color && variantFormik.errors?.color
            }
          />

          <div className="mt-4">
            <h5 className="text-sm">Ukuran</h5>
            <div className="grid grid-cols-3 gap-x-4 mt-2">
              <Input
                id="length"
                name={`size.length`}
                type="text"
                label="Panjang produk"
                placeholder="Masukkan panjang produk"
                onChange={variantFormik.handleChange}
                onBlur={variantFormik.handleBlur}
                value={variantFormik?.values?.size?.length}
                errorMessage={
                  variantFormik.touched?.size?.length &&
                  variantFormik.errors?.size?.length
                }
              />
              <Input
                id="width"
                name={`size.width`}
                type="text"
                label="Lebar produk"
                placeholder="Masukkan lebar produk"
                onChange={variantFormik.handleChange}
                onBlur={variantFormik.handleBlur}
                value={variantFormik?.values?.size?.width}
                errorMessage={
                  variantFormik.touched?.size?.width &&
                  variantFormik.errors?.size?.width
                }
              />
              <Input
                id="height"
                name={`size.height`}
                type="text"
                label="Tinggi produk"
                placeholder="Masukkan tinggi produk"
                onChange={variantFormik.handleChange}
                onBlur={variantFormik.handleBlur}
                value={variantFormik?.values?.size?.height}
                errorMessage={
                  variantFormik.touched?.size?.height &&
                  variantFormik.errors?.size?.height
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-sm">Stok & Harga</h5>

            <div className="grid grid-cols-2 gap-x-4 mt-2">
              <Input
                id="stock"
                name={`size.stock`}
                type="text"
                label="Stok produk"
                placeholder="Masukkan stok produk"
                onChange={variantFormik.handleChange}
                onBlur={variantFormik.handleBlur}
                value={variantFormik?.values?.size?.stock}
                errorMessage={
                  variantFormik.touched?.size?.stock &&
                  variantFormik.errors?.size?.stock
                }
              />
              <Input
                id="harga"
                name={`size.price`}
                type="text"
                label="Harga produk"
                placeholder="Masukkan harga produk"
                onChange={variantFormik.handleChange}
                onBlur={variantFormik.handleBlur}
                value={variantFormik?.values?.size?.price}
                errorMessage={
                  variantFormik.touched?.size?.price &&
                  variantFormik.errors?.size?.price
                }
              />
            </div>
          </div>
        </>
      </Modal>
    </>
  );
};

export default AddVariant;
