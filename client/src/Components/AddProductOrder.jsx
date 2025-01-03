import React, { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import Modal from "./Modal";
import IconButton from "./IconButton";
import axios from "axios";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";
import { HiOutlineTrash } from "react-icons/hi2";
import DropdownSelect from "./DropdownSelect";

const AddProductOrder = ({ formik, productsOrderList }) => {
  const [products, setProducts] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

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
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
        .then(({ data }) => {
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

      <ul className="flex flex-col gap-y-0 md:gap-y-4">
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
            <ul className="flex flex-col gap-y-4">
              {products &&
                products.map((product, key) => (
                  <li key={key} className="pb-4 border-b overflow-x-auto">
                    <div className="flex items-start gap-x-3 mb-2">
                      <img
                        src={`${
                          import.meta.env.VITE_API_BASE_URL
                        }/public/images/${product?.images[0]?.name}`}
                        alt={product?.images[0]?.name}
                        className="h-16 w-16 object-cover rounded-xl"
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
                      </div>
                    </div>

                    <ul className="flex flex-nowrap items-start gap-2">
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
                              <p className="w-full">Stok: {variant?.stock}</p>

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

                                <DropdownSelect
                                  id={"total-menu" + key + index}
                                  menuSize="small"
                                  minWidth="min-w-full"
                                  menuUpOrDown="top"
                                  button={
                                    <button
                                      type="button"
                                      className="flex items-center gap-x-1 py-1 px-2 text-xs text-[#71717a] border rounded-md shadow-sm"
                                    >
                                      {isSelected.total || "Pilih total dibeli"}
                                      <span>
                                        <IoChevronDownOutline
                                          className={`transition-all duration-300 ${
                                            isDropdownOpen ? "rotate-180" : ""
                                          }`}
                                        />
                                      </span>
                                    </button>
                                  }
                                  selectMenu={(() => {
                                    const items = [];
                                    for (let i = 1; i <= variant?.stock; i++) {
                                      items.push({
                                        label: i,
                                        value: i,
                                        handleMenuClicked: () => {
                                          const updateTotal =
                                            formik.values.variantId.map(
                                              (item) =>
                                                item.id === variant.id
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
                                        },
                                      });
                                    }

                                    return items;
                                  })()}
                                  defaultValue={isSelected.total}
                                />
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
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
                      src={`${
                        import.meta.env.VITE_API_BASE_URL
                      }/public/images/${item?.product?.images[0]?.name}`}
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
