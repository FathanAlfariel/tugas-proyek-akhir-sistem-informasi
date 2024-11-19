import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "./Modal";
import IconButton from "./IconButton";
import axios from "axios";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";
import { HiOutlineTrash } from "react-icons/hi2";

const AddProductOrder = ({ formik, productsOrderList }) => {
  const [products, setProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownClick = (variantId, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === variantId ? null : variantId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest("#total-menu")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getAllProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          console.log(data);
          setProducts(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllProducts();
  }, []);

  const handleDeleteProductList = (id) => {
    formik.setFieldValue(
      "variantId",
      formik.values.variantId.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      <h5 className="text-lg font-medium mb-2.5">Produk yang dipesan</h5>

      <ul className="flex flex-col gap-y-4">
        <li>
          <Modal
            id="add-product-order"
            button={
              <button
                type="button"
                className="flex justify-center items-center w-full p-5 border-2 border-dashed rounded-xl transition-all active:scale-90 duration-300"
              >
                <FiPlus className="text-2xl" />
              </button>
            }
            headerTitle="Pilih produk"
            singleActionButton={true}
            onCancel={() => formik.setFieldValue("productId", [])}
          >
            <ul className="flex flex-col gap-y-4 min-w-max">
              {products &&
                products.map((product, key) => (
                  <li key={key}>
                    <div className="flex items-start gap-x-3 pb-4 border-b">
                      <img
                        src={`http://localhost:5000/public/images/${product?.images[0]?.name}`}
                        alt={product?.images[0]?.name}
                        className="h-20 w-20 object-cover rounded-xl"
                      />

                      <div className="flex flex-col justify-between gap-y-4">
                        <div className="flex flex-col gap-y-0.5">
                          <h5 className="text-xs font-medium line-clamp-1">
                            {product?.name}
                          </h5>
                          <p className="text-xs text-[#606060] line-clamp-2">
                            {product?.description}
                          </p>
                        </div>

                        <ul className="grid grid-cols-3 gap-x-2 gap-y-2">
                          {product.variants.map((variant, index) => {
                            const isSelected = formik.values.variantId.find(
                              (item) => item.id === variant?.id
                            );
                            const isDropdownOpen = openDropdown === variant?.id;

                            return (
                              <li key={index}>
                                <label
                                  htmlFor={`variant${variant?.id}`}
                                  className="block px-4 py-1.5 border has-[:checked]:border-[#6750A4] has-[:checked]:bg-[#6750A4]/[.12] rounded-xl text-xs has-[:checked]:text-[#6750A4] has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed font-medium transition-all duration-300 cursor-pointer"
                                >
                                  <p className="text-nowrap">
                                    {variant?.color}: {variant?.length}cm x{" "}
                                    {variant?.width}cm x {variant?.height}cm
                                  </p>
                                  <p className="w-full text-nowrap">
                                    Harga:{" "}
                                    {variant?.price?.toLocaleString("id-ID", {
                                      style: "currency",
                                      currency: "IDR",
                                    })}
                                  </p>
                                  <p className="w-full">
                                    Stok: {variant?.stock}
                                  </p>

                                  <input
                                    type="checkbox"
                                    name={`variant${variant?.id}`}
                                    id={`variant${variant?.id}`}
                                    className="hidden"
                                    value={variant?.id}
                                    checked={formik.values.variantId.some(
                                      (item) => item.id === variant?.id
                                    )}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        formik.setFieldValue("variantId", [
                                          ...formik.values.variantId,
                                          {
                                            id: variant?.id,
                                            total: 1,
                                          },
                                        ]);
                                      } else {
                                        const deleteVariant =
                                          formik.values.variantId.filter(
                                            (item) => item.id !== variant?.id
                                          );
                                        formik.setFieldValue(
                                          "variantId",
                                          deleteVariant
                                        );
                                      }
                                    }}
                                    disabled={
                                      variant?.size?.stock === 0 ? true : false
                                    }
                                  />
                                </label>

                                {isSelected && (
                                  <div className="flex items-center gap-x-2 w-full">
                                    <p className="text-xs font-medium text-nowrap">
                                      Total dibeli:
                                    </p>

                                    <div
                                      className="relative w-full"
                                      id="total-menu"
                                    >
                                      <button
                                        type="button"
                                        onClick={(e) =>
                                          handleDropdownClick(variant?.id, e)
                                        }
                                        className="flex items-center gap-x-1 py-1 px-2 text-xs text-[#71717a] border rounded-md shadow-sm"
                                      >
                                        {isSelected.total ||
                                          "Pilih total dibeli"}
                                        <span>
                                          <IoChevronDownOutline
                                            className={`transition-all duration-300 ${
                                              isDropdownOpen ? "rotate-180" : ""
                                            }`}
                                          />
                                        </span>
                                      </button>

                                      {/* Selected total */}
                                      {isDropdownOpen && (
                                        <div className="absolute top-full left-0 z-10 w-full py-2 bg-white border rounded-xl max-h-28 overflow-y-auto">
                                          <ul className="flex flex-col gap-y-0.5">
                                            {(() => {
                                              const items = [];
                                              for (
                                                let i = 1;
                                                i <= variant?.stock;
                                                i++
                                              ) {
                                                items.push(
                                                  <li key={i}>
                                                    <button
                                                      type="button"
                                                      onClick={() => {
                                                        const updateTotal =
                                                          formik.values.variantId.map(
                                                            (item) =>
                                                              item.id ===
                                                              variant.id
                                                                ? {
                                                                    ...item,
                                                                    total: i,
                                                                  }
                                                                : item
                                                          );

                                                        formik.setFieldValue(
                                                          "variantId",
                                                          updateTotal
                                                        );

                                                        setOpenDropdown(false);
                                                      }}
                                                      className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-xs hover:bg-[#1D1B20]/[.08]"
                                                    >
                                                      {(() => {
                                                        const getStock =
                                                          formik.values.variantId.find(
                                                            (item) =>
                                                              item.id ===
                                                              variant?.id
                                                          );

                                                        return getStock.total ===
                                                          i ? (
                                                          <span>
                                                            <IoCheckmarkSharp className="text-base" />
                                                          </span>
                                                        ) : (
                                                          <span>
                                                            <IoCheckmarkSharp className="invisible text-base" />
                                                          </span>
                                                        );
                                                      })()}

                                                      {i}
                                                    </button>
                                                  </li>
                                                );
                                              }

                                              return items;
                                            })()}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </Modal>
        </li>
        <li className="flex flex-col gap-y-4 max-h-64 overflow-y-auto">
          {productsOrderList &&
            productsOrderList.map((item, key) => {
              return (
                <div
                  key={key}
                  className="flex justify-between items-center gap-x-3"
                >
                  <div className="grow flex items-center gap-x-3">
                    <img
                      src={`http://localhost:5000/public/images/${item?.product?.images[0]?.name}`}
                      alt={item?.product?.images[0]?.name}
                      className="w-16 h-16 object-cover rounded-xl"
                    />

                    <div>
                      <p className="text-xs font-medium line-clamp-1">
                        {item?.product?.name}
                      </p>
                      <p className="text-xs text-[#606060] font-medium line-clamp-1">
                        Ukuran:{" "}
                        <span className="text-black">
                          {item?.length}cm x {item?.width}cm x {item?.height}cm
                        </span>
                      </p>
                      <p className="text-xs font-medium">
                        {item?.price.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                        <span className="text-[#606060]">
                          {" x"}
                          {item?.total}
                        </span>
                      </p>
                    </div>
                  </div>

                  <IconButton
                    type="button"
                    buttonType="icon"
                    onClick={() => handleDeleteProductList(item?.id)}
                  >
                    <HiOutlineTrash className="text-xl" />
                  </IconButton>
                </div>
              );
            })}
        </li>
      </ul>
    </>
  );
};

export default AddProductOrder;
