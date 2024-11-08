import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "../Components/Modal";
import axios from "axios";

const AddProductOrder = ({ formik }) => {
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);

  const handleShowModal = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const getAllProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          setProducts(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllProducts();
  }, []);

  const handleSelectedVariant = (productId, variantId, isChecked) => {
    const existingProduct = formik.values.productId.find(
      (item) => item.product === productId
    );

    if (isChecked) {
      // Add the variant if it doesn't exist
      if (existingProduct) {
        const updatedVariants = [
          ...existingProduct.variants,
          { variant: variantId, total: 0 },
        ];
        const updatedProductList = formik.values.productId.map((item) =>
          item.product === productId
            ? { ...item, variants: updatedVariants }
            : item
        );
        formik.setFieldValue("productId", updatedProductList);
      } else {
        formik.setFieldValue("productId", [
          ...formik.values.productId,
          {
            product: productId,
            variants: [{ variant: variantId, total: 0 }],
          },
        ]);
      }
    } else {
      // Remove the variant if it exists
      if (existingProduct) {
        const updatedVariants = existingProduct.variants.filter(
          (variant) => variant.variant !== variantId
        );

        const updatedProductList =
          updatedVariants.length > 0
            ? formik.values.productId.map((item) =>
                item.product === productId
                  ? { ...item, variants: updatedVariants }
                  : item
              )
            : formik.values.productId.filter(
                (item) => item.product !== productId
              );

        formik.setFieldValue("productId", updatedProductList);
      }
    }
  };

  return (
    <>
      <h5 className="text-lg font-medium mb-2.5">Produk yang dipesan</h5>

      <div>
        <button
          type="button"
          onClick={handleShowModal}
          className="flex justify-center items-center w-full p-5 border-2 border-dashed rounded-xl transition-all active:scale-90 duration-300"
        >
          <FiPlus className="text-2xl" />
        </button>
      </div>

      {/* Product selection modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        headerTitle="Pilih produk"
      >
        <ul className="flex flex-col gap-y-4 min-w-max">
          {products &&
            products.map((product, key) => {
              return (
                <li key={key}>
                  <div className="flex items-start gap-x-3 border-b">
                    {/* Image */}
                    <img
                      src={`http://localhost:5000/public/images/${product.images[0]}`}
                      alt={product.images[0]}
                      className="h-20 w-20 object-cover rounded-xl"
                    />

                    <div className="flex flex-col justify-between gap-y-4">
                      {/* Title and Description */}
                      <div className="flex flex-col gap-y-0.5">
                        {/* Title */}
                        <h5 className="text-xs font-medium line-clamp-1">
                          {product.name}
                        </h5>
                        {/* Description */}
                        <p className="text-xs text-[#606060] line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      {/* Variants */}
                      <ul className="grid grid-cols-3 gap-x-4">
                        {product.variants.map((variant, key) => {
                          const isVariantSelected =
                            formik.values.productId.find(
                              (item) =>
                                item.product === product._id &&
                                item.variants.some(
                                  (v) => v.variant === variant._id
                                )
                            );

                          return (
                            <li key={key}>
                              <label
                                htmlFor={`variant${variant._id}`}
                                className="block px-4 py-1.5 border has-[:checked]:border-[#6750A4] has-[:checked]:bg-[#6750A4]/[.12] rounded-xl text-xs has-[:checked]:text-[#6750A4] font-medium transition-all duration-300 cursor-pointer"
                              >
                                <p className="text-nowrap">
                                  {variant.color}: {variant.size.length}cm x{" "}
                                  {variant.size.width}cm x {variant.size.height}
                                  cm
                                </p>
                                <p className="w-full text-nowrap">
                                  Harga:{" "}
                                  {variant.size.price.toLocaleString("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  })}
                                </p>
                                <p className="w-full">
                                  Stok: {variant.size.stock}
                                </p>

                                <input
                                  type="checkbox"
                                  name={`variant${variant._id}`}
                                  id={`variant${variant._id}`}
                                  className="hidden"
                                  value={variant._id}
                                  onChange={(e) =>
                                    handleSelectedVariant(
                                      product._id,
                                      variant._id,
                                      e.target.checked
                                    )
                                  }
                                />
                              </label>

                              {/* Total dibeli */}
                              <div
                                className={`${
                                  isVariantSelected ? "visible" : "invisible"
                                } flex items-center gap-x-2 w-full my-0.5`}
                              >
                                <label
                                  htmlFor={`total${variant._id}`}
                                  className="text-xs font-medium text-nowrap"
                                >
                                  Total dibeli:
                                </label>

                                <input
                                  id={`total${variant._id}`}
                                  type="text"
                                  placeholder="Masukkan total dibeli"
                                  className="outline-none w-full text-xs"
                                  autoFocus
                                  onChange={() => handleTotal()}
                                />
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      </Modal>
    </>
  );
};

export default AddProductOrder;
