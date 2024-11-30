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
import { useSearchParams } from "react-router-dom";
import Filter from "../Components/Filter";
import { IoMdClose } from "react-icons/io";

const Product = () => {
  const [products, setProducts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [titleParams, setTitleParams] = useState(currentParams?.title || "");
  const [descParams, setDescParams] = useState(currentParams?.desc || "");
  const [visibilityParams, setVisibilityParams] = useState(
    currentParams?.visibility || ""
  );
  const [dateParams, setDateParams] = useState(currentParams?.sortOrder || "");

  // Get all products
  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get(`http://localhost:5000/api/product?${searchParams}`)
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
  }, [searchParams]);

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

      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Produk
      </h1>

      {/* Filter */}
      <div className="border-y py-3">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Title Filter */}
          <Filter
            id="title-filter"
            headerTitle="Judul"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.title ? (
                  <>
                    Judul: {currentParams.title}
                    <span
                      title="Hapus filter judul"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["title"];

                        setSearchParams(updatedParams);
                        setTitleParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Judul"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({ ...currentParams, title: titleParams })
            }
            disabledButton={titleParams === "" ? true : false}
          >
            <label htmlFor="judul" className="block text-xs font-medium">
              Masukkan judul
            </label>

            <input
              autoFocus
              id="judul"
              type="text"
              placeholder="Judul"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={titleParams}
              onChange={(e) => setTitleParams(e.target.value)}
            />
          </Filter>

          {/* Description Filter */}
          <Filter
            id="desc-filter"
            headerTitle="Deskripsi"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.desc ? (
                  <>
                    Deskripsi: {currentParams.desc}
                    <span
                      title="Hapus filter deskripsi"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["desc"];

                        setSearchParams(updatedParams);
                        setDescParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Deskripsi"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({ ...currentParams, desc: descParams })
            }
            disabledButton={descParams === "" ? true : false}
          >
            <label htmlFor="desc" className="block text-xs font-medium">
              Masukkan deskripsi
            </label>

            <input
              autoFocus
              id="desc"
              type="text"
              placeholder="Deskripsi"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={descParams}
              onChange={(e) => setDescParams(e.target.value)}
            />
          </Filter>

          {/* Visibility Filter */}
          <Filter
            id="visibility-filter"
            headerTitle="Visibilitas"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 capitalize text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.visibility ? (
                  <>
                    Visibilitas: {currentParams?.visibility}
                    <span
                      title="Hapus filter deskripsi"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["visibility"];

                        setSearchParams(updatedParams);
                        setVisibilityParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Visibilitas"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                visibility: visibilityParams,
              })
            }
            disabledButton={visibilityParams === "" ? true : false}
          >
            <label
              htmlFor="vis-public"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="vis-public"
                type="radio"
                name="visibility"
                value="public"
                onChange={(e) => setVisibilityParams(e.target.value)}
                checked={visibilityParams === "public"}
              />
              Public
            </label>

            <label
              htmlFor="vis-private"
              className="block flex items-center gap-x-3 text-xs font-medium"
            >
              <input
                id="vis-private"
                type="radio"
                name="visibility"
                value="private"
                onChange={(e) => setVisibilityParams(e.target.value)}
                checked={visibilityParams === "private"}
              />
              Private
            </label>
          </Filter>

          {/* Date Filter */}
          <Filter
            id="date-filter"
            headerTitle="Tanggal dibuat"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.sortOrder ? (
                  <>
                    Tanggal dibuat:{" "}
                    {currentParams.sortOrder === "latest"
                      ? "Terbaru"
                      : currentParams.sortOrder === "oldest"
                      ? "Terlama"
                      : null}
                    <span
                      title="Hapus filter tanggal dibuat"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["sortOrder"];

                        setSearchParams(updatedParams);
                        setDateParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Tanggal dibuat"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({ ...currentParams, sortOrder: dateParams })
            }
            disabledButton={dateParams === "" ? true : false}
          >
            <label
              htmlFor="latest"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="latest"
                type="radio"
                name="visibility"
                value="latest"
                onChange={(e) => setDateParams(e.target.value)}
                checked={dateParams === "latest"}
              />
              Terbaru
            </label>

            <label
              htmlFor="oldest"
              className="block flex items-center gap-x-3 text-xs font-medium"
            >
              <input
                id="oldest"
                type="radio"
                name="visibility"
                value="oldest"
                onChange={(e) => setDateParams(e.target.value)}
                checked={dateParams === "oldest"}
              />
              Terlama
            </label>
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
                    <td className="pl-6 py-3 w-auto">
                      {product?.variants?.map((variant, key) => {
                        return (
                          <p key={key} className="text-xs">
                            {variant?.color}:{" "}
                            <span className="before:content-['('] after:content-[')']">
                              {`${variant?.length}cm x ${variant?.width}cm x ${variant?.height}cm`}
                            </span>{" "}
                            <span className="before:content-['('] after:content-[')'] font-semibold">
                              {variant.stock}
                            </span>
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
