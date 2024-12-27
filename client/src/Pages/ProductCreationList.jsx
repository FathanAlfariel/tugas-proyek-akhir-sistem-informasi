import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import IconButton from "../Components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";
import { AiOutlineStop } from "react-icons/ai";
import Filter from "../Components/Filter";
import { useSearchParams } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const ProductCreationList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [tailors, setTailors] = useState([]);

  console.log(products);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [productParams, setProductParams] = useState(
    currentParams?.product || ""
  );
  const [tailorParams, setTailorParams] = useState(currentParams?.tailor || []);
  const [statusParams, setStatusParams] = useState(currentParams?.status || []);

  // Get all productions
  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/product-creation?${searchParams}`
        )
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

    // Mengupdate countdown setiap detik
    const interval = setInterval(fetchProducts, 1000);

    return () => clearInterval(interval);
  }, [searchParams]);

  // Get all tailors
  useEffect(() => {
    const fetchTailors = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/tailor`)
        .then(({ data }) => {
          setTailors(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchTailors();
  }, []);

  // Updated status
  useEffect(() => {
    const interval = setInterval(async () => {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-creation/statuses`
      );
    }, 1000); // Setiap 1 detik

    return () => clearInterval(interval);
  }, []);

  // Delete production
  const handleDelete = async (id) => {
    setIsLoading(true);

    await axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/product-creation/${id}`)
      .then(({ data }) => {
        const updateData = products.filter((item) => item.id !== id);

        setProducts(updateData);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Cancel production
  const handleCancel = async (id) => {
    setIsLoading(true);

    await axios
      .put(
        `${import.meta.env.VITE_API_BASE_URL}/api/product-creation/cancel/${id}`
      )
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle tailor filter
  const handleTailorCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedTailor;

    if (e.target.checked) {
      // Tambahkan status baru
      updatedTailor = [...tailorParams, value];
    } else {
      // Hapus status jika tidak dicentang
      updatedTailor = tailorParams.filter((id) => id !== value);
    }

    // Update state
    setTailorParams(updatedTailor);
  };

  // Handle status filter
  const handleStatusCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedStatus;

    if (e.target.checked) {
      // Tambahkan status baru
      updatedStatus = [...statusParams, value];
    } else {
      // Hapus status jika tidak dicentang
      updatedStatus = statusParams.filter((item) => item !== value);
    }

    // Update state
    setStatusParams(updatedStatus);
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="border-b pt-1 pb-3">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Product Filter */}
          <Filter
            id="produk-filter"
            headerTitle="Nama produk"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 capitalize text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.product ? (
                  <>
                    Nama produk: {currentParams.product}
                    <span
                      title="Hapus filter nama produk"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["product"];

                        setSearchParams(updatedParams);
                        setProductParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Nama produk"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({ ...currentParams, product: productParams })
            }
            disabledButton={productParams === "" ? true : false}
          >
            <label htmlFor="produk" className="block text-xs font-medium">
              Masukkan produk
            </label>

            <input
              autoFocus
              id="judul"
              type="text"
              placeholder="Masukkan nama produk"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={productParams}
              onChange={(e) => setProductParams(e.target.value)}
            />
          </Filter>

          {/* Tailor Filter */}
          <Filter
            id="tailor-filter"
            headerTitle="Penjahit"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.tailor ? (
                  <>
                    Penjahit:{" "}
                    {(() => {
                      const tailor = tailors?.find(
                        (item) => item.id === currentParams?.tailor
                      );

                      return tailor?.name;
                    })()}
                    <span
                      title="Hapus filter status pesanan"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["tailor"];

                        setSearchParams(updatedParams);
                        setTailorParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Penjahit"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                tailor: tailorParams.join(","),
              })
            }
            disabledButton={tailorParams.length === 0 ? true : false}
          >
            {tailors &&
              tailors?.map((tailor, key) => {
                return (
                  <label
                    key={key}
                    htmlFor={tailor?.name}
                    className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
                  >
                    <input
                      id={tailor?.name}
                      type="checkbox"
                      value={tailor?.id}
                      checked={tailorParams.includes(tailor?.id)}
                      onChange={handleTailorCheckboxChange}
                    />
                    {tailor?.name}
                  </label>
                );
              })}
          </Filter>

          {/* Status Filter */}
          <Filter
            id="status-filter"
            headerTitle="Status"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 capitalize text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.status ? (
                  <>
                    Status:{" "}
                    {currentParams?.status
                      .split(",") // Pisahkan berdasarkan koma
                      .map((item) => {
                        const formattedItem = item
                          .split("_") // Pisahkan berdasarkan underscore
                          .join(" "); // Gabungkan dengan spasi
                        return (
                          formattedItem.charAt(0).toUpperCase() +
                          formattedItem.slice(1)
                        ); // Kapitalisasi huruf pertama
                      })
                      .join(", ")}
                    <span
                      title="Hapus filter status"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["status"];

                        setSearchParams(updatedParams);
                        setStatusParams([]);
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Status"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                status: statusParams.join(","),
              })
            }
            disabledButton={statusParams.length === 0 ? true : false}
          >
            <label
              htmlFor="belum_dimulai-checkbox"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="belum_dimulai-checkbox"
                type="checkbox"
                value="belum_dimulai"
                checked={statusParams.includes("belum_dimulai")}
                onChange={handleStatusCheckboxChange}
              />
              Belum dimulai
            </label>

            <label
              htmlFor="dalam_proses-checkbox"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="dalam_proses-checkbox"
                type="checkbox"
                value="dalam_proses"
                checked={statusParams.includes("dalam_proses")}
                onChange={handleStatusCheckboxChange}
              />
              Dalam proses
            </label>

            <label
              htmlFor="selesai-checkbox"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="selesai-checkbox"
                type="checkbox"
                value="selesai"
                checked={statusParams.includes("selesai")}
                onChange={handleStatusCheckboxChange}
              />
              Selesai
            </label>

            <label
              htmlFor="dibatalkan-checkbox"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="dibatalkan-checkbox"
                type="checkbox"
                value="dibatalkan"
                checked={statusParams.includes("dibatalkan")}
                onChange={handleStatusCheckboxChange}
              />
              Dibatalkan
            </label>
          </Filter>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pl-0 md:pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Produk
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Penjahit
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Status
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Estimasi
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product, key) => {
                return (
                  <tr key={key} className="border-b">
                    <td className="pl-0 md:pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm">{product?.name}</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm">{product?.tailor?.name}</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      {product?.status === "belum_dimulai" ? (
                        <span className="px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
                          {product?.status?.charAt(0).toUpperCase() +
                            product?.status?.slice(1).split("_").join(" ")}
                        </span>
                      ) : product?.status === "dalam_proses" ? (
                        <span className="px-3 py-1.5 bg-[#6750A4]/[.12] rounded-full text-xs text-[#6750A4] font-medium">
                          {product?.status?.charAt(0).toUpperCase() +
                            product?.status?.slice(1).split("_").join(" ")}
                        </span>
                      ) : product?.status === "selesai" ? (
                        <span className="px-3 py-1.5 bg-[#00712D]/[.12] rounded-full text-xs text-[#00712D] font-medium">
                          {product?.status?.charAt(0).toUpperCase() +
                            product?.status?.slice(1)}
                        </span>
                      ) : product?.status === "dibatalkan" ? (
                        <span className="px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
                          {product?.status?.charAt(0).toUpperCase() +
                            product?.status?.slice(1)}
                        </span>
                      ) : null}
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <span className="px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
                        {product?.status === "belum_dimulai" ||
                        product?.status === "selesai" ||
                        product?.status === "dibatalkan" ? (
                          "00:00:00:00"
                        ) : product?.status === "dalam_proses" ? (
                          <>
                            <span title="Hari" className="after:content-[':']">
                              {product?.countdown?.days
                                ?.toString()
                                .padStart(2, "0")}
                            </span>
                            <span title="Jam" className="after:content-[':']">
                              {product?.countdown?.hours
                                ?.toString()
                                .padStart(2, "0")}
                            </span>
                            <span title="Menit" className="after:content-[':']">
                              {product?.countdown?.minutes
                                ?.toString()
                                .padStart(2, "0")}
                            </span>
                            <span title="Detik">
                              {product?.countdown?.seconds
                                ?.toString()
                                .padStart(2, "0")}
                            </span>
                          </>
                        ) : null}
                      </span>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-x-1">
                        {product?.status === "belum_dimulai" ||
                        product?.status === "dalam_proses" ? (
                          <IconButton
                            type="button"
                            title="Batalkan pembuatan"
                            onClick={() => handleCancel(product?.id)}
                            buttonType="icon"
                          >
                            <AiOutlineStop className="text-lg" />
                          </IconButton>
                        ) : null}

                        <IconButton
                          type="button"
                          title="Hapus pembuatan"
                          onClick={() => handleDelete(product?.id)}
                          buttonType="icon"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-sm text-center py-6 text-[#606060]">
            Tidak ada data yang ditemukan
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCreationList;
