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

const Product = () => {
  const [products, setProducts] = useState(null);

  const [moreMenuProductId, setMoreMenuProductId] = useState(null);
  const [visibilityMenuProductId, setVisibilityMenuProductId] = useState(null);

  // Get all products
  useEffect(() => {
    const fetchProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          setProducts(data.getAllProducts);
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
            ? { ...product, visibility: data.updateVisibility.visibility }
            : product;
        });
      });

      setVisibilityMenuProductId(null);
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

  const handleShowMoreMenu = (productId) => {
    setMoreMenuProductId((prev) => (prev === productId ? null : productId));
  };

  const handleShowVisibilityMenu = (productId) => {
    setVisibilityMenuProductId((prev) =>
      prev === productId ? null : productId
    );
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest("#more-menu") && moreMenuProductId) {
      setMoreMenuProductId(null);
    }
    if (!e.target.closest("#visibility-menu") && visibilityMenuProductId) {
      setVisibilityMenuProductId(null);
    }
  };

  useEffect(() => {
    if (moreMenuProductId || visibilityMenuProductId) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [moreMenuProductId, visibilityMenuProductId]);

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Produk</h1>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pl-6 py-4 text-xs text-left font-medium">Produk</th>
            <th className="pl-6 py-4 text-xs text-left font-medium">
              Visibilitas
            </th>
            <th className="pl-6 py-4 text-xs text-left font-medium">Tanggal</th>
            <th className="pl-6 py-4 text-xs text-left font-medium">Dibeli</th>
          </tr>
        </thead>
        <tbody>
          {products &&
            products.map((product, key) => {
              return (
                <tr key={key} className="border-b">
                  <td className="flex gap-x-4 pl-6 py-3">
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
                    <div id="more-menu" className="relative">
                      {/* Action / More menu button */}
                      <button
                        onClick={() => handleShowMoreMenu(product?._id)}
                        className="p-2 hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] rounded-full transition-all active:scale-90 duration-300"
                      >
                        <IoMdMore className="text-lg" />
                      </button>

                      {/* Action / More menu */}
                      {moreMenuProductId === product?._id && (
                        <div className="absolute top-0 right-0 shadow bg-white min-w-40 py-2.5 rounded-xl border border-[#F1F1F1] z-10">
                          <ul>
                            <li>
                              <Link to={`/admin/product/edit/${product?._id}`}>
                                <button className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]">
                                  <span>
                                    <HiOutlinePencil className="text-xl" />
                                  </span>
                                  Edit
                                </button>
                              </Link>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleDeleteProduct(product?._id)
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                <span>
                                  <HiOutlineTrash className="text-xl" />
                                </span>
                                Hapus
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Visibility */}
                  <td className="pl-6 py-3">
                    <div id="visibility-menu" className="relative inline-flex">
                      {/* Visibility menu button */}
                      <button
                        onClick={() => handleShowVisibilityMenu(product?._id)}
                        className="group flex items-center gap-x-2 pl-3 pr-4 py-2.5 text-sm capitalize rounded-full hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12] transition-all active:scale-90 duration-300"
                      >
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

                      {/* Visibility menu */}
                      {visibilityMenuProductId === product?._id && (
                        <div className="absolute top-0 left-0 shadow bg-white min-w-40 py-2.5 rounded-xl border border-[#F1F1F1]">
                          <ul>
                            <li>
                              <button
                                onClick={() =>
                                  handleChangeVisibility(product?._id, "public")
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {product?.visibility === "public" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Public
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleChangeVisibility(
                                    product?._id,
                                    "private"
                                  )
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {product?.visibility === "private" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Private
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="pl-6 py-3">
                    <p className="text-xs">
                      {new Date(product?.createdAt).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" }
                      )}
                    </p>
                    <p className="text-xs font-medium">Ditambahkan</p>
                  </td>
                  <td className="pl-6 py-3">
                    <p className="text-xs">0</p>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};

export default Product;
