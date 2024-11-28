import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdMore } from "react-icons/io";
import {
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineGlobeAsiaAustralia,
} from "react-icons/hi2";
import { IoChevronDownOutline } from "react-icons/io5";
import { PiLockKey } from "react-icons/pi";
import { Link } from "react-router-dom";
import DropdownSelect from "../Components/DropdownSelect";
import Dropdown from "../Components/Dropdown";
import Loader from "../Components/Loader";
import { RiFilter3Fill } from "react-icons/ri";
import IconButton from "../Components/IconButton";
import { useSearchParams } from "react-router-dom";
import Filter from "../Components/Filter";

const Product = () => {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  // Get all products
  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          setProducts(data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchProducts();
  }, []);

  // Change visibility product
  const handleChangeVisibility = async (id, visibility) => {
    setIsLoading(true);

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
          return product.id === id
            ? { ...product, visibility: data.results.visibility }
            : product;
        });
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    setIsLoading(true);

    try {
      const { data } = await axios.delete(
        `http://localhost:5000/api/product/${id}`
      );

      // Update data products
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-[28px] leading-9 font-medium mb-4">Produk</h1>

      {/* Search and filter */}
      <div className="border-y py-3">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2">
          <Filter
            id="title-filter"
            headerTitle="Judul"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Judul
              </button>
            }
          >
            Judul
          </Filter>

          <Filter
            id="desc-filter"
            headerTitle="Deskripsi"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Deskripsi
              </button>
            }
          >
            Deskripsi
          </Filter>

          <Filter
            id="visibility-filter"
            headerTitle="Visibilitas"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Visibilitas
              </button>
            }
          >
            Visibilitas
          </Filter>

          <Filter
            id="date-filter"
            headerTitle="Tanggal dibuat"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Tanggal dibuat
              </button>
            }
          >
            Tanggal dibuat
          </Filter>
        </div>
      </div>

      {/* Products list for tablet and desktop */}
      <div className="hidden md:block overflow-x-auto md:overflow-visible">
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
                Variant
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
                        src={`http://localhost:5000/public/images/${product?.images[0]?.name}`}
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
                            url: `/admin/product/edit/${product?.id}`,
                            icon: <HiOutlinePencil />,
                            label: "Edit",
                          },
                          {
                            icon: <HiOutlineTrash />,
                            label: "Hapus",
                            handleMenuClicked: () =>
                              handleDeleteProduct(product?.id),
                          },
                        ]}
                      />
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
                              handleChangeVisibility(product?.id, "public"),
                          },
                          {
                            label: "Private",
                            value: "private",
                            handleMenuClicked: () =>
                              handleChangeVisibility(product?.id, "private"),
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
                      {product?.variants?.map((variant, key) => {
                        return (
                          <p key={key} className="text-xs">
                            {variant?.color}
                          </p>
                        );
                      })}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Products list for mobile */}
      <div className="flex md:hidden flex-col gap-y-4 mt-4">
        {products &&
          products.map((product, key) => {
            return (
              <div key={key} className="flex item-start gap-x-3">
                <img
                  src={`http://localhost:5000/public/images/${product.images[0]?.name}`}
                  alt={product.images[0]}
                  className="h-20 w-20 object-contain rounded-lg"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs line-clamp-2">{product.name}</p>
                    <p className="text-xs text-[#606060] line-clamp-1 py-1">
                      0 dibeli &#128900;{" "}
                      {new Date(product.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-x-2.5">
                    <DropdownSelect
                      id={"visibility-phone-menu" + key}
                      button={
                        <button
                          type="button"
                          className="block transition-all active:scale-90 duration-300"
                        >
                          {product?.visibility === "public" ? (
                            <span>
                              <HiOutlineGlobeAsiaAustralia className="text-base text-black" />
                            </span>
                          ) : (
                            <span>
                              <PiLockKey className="text-base text-black" />
                            </span>
                          )}
                        </button>
                      }
                      selectMenu={[
                        {
                          label: "Public",
                          value: "public",
                          handleMenuClicked: () =>
                            handleChangeVisibility(product?.id, "public"),
                        },
                        {
                          label: "Private",
                          value: "private",
                          handleMenuClicked: () =>
                            handleChangeVisibility(product?.id, "private"),
                        },
                      ]}
                      defaultValue={product?.visibility}
                    />

                    <Link to={`/admin/product/edit/${product?.id}`}>
                      <button
                        type="button"
                        className="block transition-all active:scale-90 duration-300"
                      >
                        <span>
                          <HiOutlinePencil className="text-base text-black" />
                        </span>
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product?.id)}
                      className="transition-all active:scale-90 duration-300"
                    >
                      <span>
                        <HiOutlineTrash className="text-base text-black" />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Product;
