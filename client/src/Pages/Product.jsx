import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdMore } from "react-icons/io";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineGlobeAsiaAustralia,
} from "react-icons/hi2";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";
import { PiLockKey } from "react-icons/pi";
import { Link } from "react-router-dom";
import DropdownSelect from "../Components/DropdownSelect";
import Dropdown from "../Components/Dropdown";

const Product = () => {
  const [products, setProducts] = useState(null);

  // Get all products
  useEffect(() => {
    const fetchProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          setProducts(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchProducts();
  }, []);

  // Change visibility product
  const handleChangeVisibility = async (id, visibility) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/product/visibility/${id}`,
        {
          visibility: visibility,
        }
      );

      // Update visibility product
      setProducts((prev) => {
        return prev.map((product) => {
          return product._id === id
            ? { ...product, visibility: data.results.visibility }
            : product;
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/product/${id}`
      );

      // Update data products
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Produk</h1>

      <div className="overflow-x-auto md:overflow-visible">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pl-0 md:pl-6 py-4 text-xs text-left font-medium">
                Produk
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium">
                Visibilitas
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium">
                Tanggal
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium">
                Dibeli
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product, key) => {
                return (
                  <tr key={key} className="border-b">
                    <td className="flex gap-x-4 pl-0 md:pl-6 py-3 whitespace-nowrap">
                      <img
                        src={`http://localhost:5000/public/images/${product?.images[0]}`}
                        alt={product?.images[0]}
                        className="w-16 h-16 object-cover rounded-xl"
                      />

                      <div className="grow">
                        <p className="text-sm line-clamp-2">{product?.name}</p>
                        <p className="text-xs text-[#606060] line-clamp-2 mt-0.5">
                          {product?.description}
                        </p>
                      </div>

                      {/* Action / More */}
                      <div>
                        <Dropdown
                          id={"more-menu" + key}
                          menuDirection="right"
                          button={
                            <button className="p-2 hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] rounded-full transition-all active:scale-90 duration-300">
                              <IoMdMore className="text-lg" />
                            </button>
                          }
                          selectMenu={[
                            {
                              type: "link",
                              url: `/admin/product/edit/${product?._id}`,
                              icon: <HiOutlinePencil />,
                              label: "Edit",
                            },
                            {
                              handleMenuClicked: () =>
                                handleDeleteProduct(product?._id),
                              icon: <HiOutlineTrash />,
                              label: "Hapus",
                            },
                          ]}
                        />
                      </div>
                    </td>

                    {/* Visibility */}
                    <td className="pl-6 py-3 whitespace-nowrap">
                      <DropdownSelect
                        id={"visibility-menu" + key}
                        button={
                          <button className="group flex items-center gap-x-2 px-3 py-2.5 text-sm capitalize rounded-full hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12] transition-all active:scale-90 duration-300">
                            {product?.visibility === "public" ? (
                              <>
                                <span>
                                  <HiOutlineGlobeAsiaAustralia className="text-xl" />
                                </span>

                                {product?.visibility}
                              </>
                            ) : (
                              <>
                                <span>
                                  <PiLockKey className="text-xl" />
                                </span>

                                {product?.visibility}
                              </>
                            )}

                            <span className="invisible group-hover:visible">
                              <IoChevronDownOutline />
                            </span>
                          </button>
                        }
                        selectMenu={[
                          {
                            label: "Public",
                            value: "public",
                            handleMenuClicked: () =>
                              handleChangeVisibility(product?._id, "public"),
                          },
                          {
                            label: "Private",
                            value: "private",
                            handleMenuClicked: () =>
                              handleChangeVisibility(product?._id, "private"),
                          },
                        ]}
                        defaultValue={product?.visibility}
                      />
                    </td>
                    <td className="pl-6 py-3 whitespace-nowrap">
                      <p className="text-xs">
                        {new Date(product?.createdAt).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" }
                        )}
                      </p>
                      <p className="text-xs font-medium">Ditambahkan</p>
                    </td>
                    <td className="pl-6 py-3 whitespace-nowrap">
                      <p className="text-xs">0</p>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Product;
