import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [productCreations, setProductCreations] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const getProductsWithLowStock = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/product`)
        .then(({ data }) => {
          setProducts(
            data?.results.filter((product) =>
              product.variants.some((variant) => variant.stock <= 5)
            )
          );
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getProductsWithLowStock();
  }, []);

  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/product-creation`)
        .then(({ data }) => {
          setProductCreations(
            data.results.filter(
              (item) =>
                item?.countdown?.days === 0 && item?.countdown?.hours <= 24
            )
          );
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
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <li className="max-h-[30rem] min-w-full md:min-w-96 py-4 border border-black/[.1] rounded-2xl overflow-y-auto">
        <h5 className="px-5 text-lg font-semibold">Notifikasi</h5>

        <div className="mt-2.5">
          <ul className="flex flex-col">
            {products?.map((prod) =>
              prod?.variants?.map((variant, key) => (
                <li
                  title={`Pengingat: Stok produk tersisa ${variant?.stock}. Silahkan tambahkan stok produk`}
                  key={key}
                  className="py-2.5 px-5 flex items-start gap-x-2 hover:bg-[#1D1B20]/[.08]"
                >
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/public/images/${
                      prod?.images[0]?.name
                    }`}
                    alt={prod?.images[0]?.name}
                    className="min-w-16 min-h-16 w-16 h-16 object-cover rounded-lg"
                  />

                  <div className="flex flex-col gap-y-0.5">
                    <p className="text-sm line-clamp-2">{prod?.name}</p>
                    <p className="text-xs text-[#52525B] line-clamp-1">
                      Variant: {variant?.color}
                    </p>
                    <p className="text-xs text-[#52525B] line-clamp-1">
                      Stok: {variant?.stock}
                    </p>
                  </div>
                </li>
              ))
            )}

            {productCreations?.map((prod, key) => {
              return (
                <li
                  key={key}
                  title="Pengingat: Produk Anda akan segera selesai"
                  className="py-2.5 px-5 flex justify-between items-start hover:bg-[#1D1B20]/[.08]"
                >
                  <div className="flex flex-col gap-y-0.5">
                    <p className="text-sm line-clamp-2">
                      Pembuatan produk:{" "}
                      <span className="font-medium">{prod?.name}</span>
                    </p>
                    <p className="text-xs text-[#52525B] line-clamp-1">
                      Total: {prod?.total}
                    </p>
                    <p className="text-xs text-[#52525B] line-clamp-1">
                      Penjahit: {prod?.tailor?.name}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
                    {prod?.status === "belum_dimulai" ||
                    prod?.status === "selesai" ||
                    prod?.status === "dibatalkan" ? (
                      "00:00:00:00"
                    ) : prod?.status === "dalam_proses" ? (
                      <>
                        <span title="Hari" className="after:content-[':']">
                          {prod?.countdown?.days?.toString().padStart(2, "0")}
                        </span>
                        <span title="Jam" className="after:content-[':']">
                          {prod?.countdown?.hours?.toString().padStart(2, "0")}
                        </span>
                        <span title="Menit" className="after:content-[':']">
                          {prod?.countdown?.minutes
                            ?.toString()
                            .padStart(2, "0")}
                        </span>
                        <span title="Detik">
                          {prod?.countdown?.seconds
                            ?.toString()
                            .padStart(2, "0")}
                        </span>
                      </>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </li>
    </>
  );
};

export default Notification;
