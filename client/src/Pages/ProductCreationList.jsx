import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import IconButton from "../Components/IconButton";
import { HiOutlineTrash } from "react-icons/hi2";

const ProductCreationList = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product-creation")
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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      products.forEach(async (product) => {
        const now = new Date();
        const start = new Date(product?.startDate);

        if (
          now.getTime() >= start.getTime() &&
          product.status === "belum_dimulai"
        ) {
          await axios.put(
            `http://localhost:5000/api/product-creation/status/${product.id}`
          );
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <>
      {isLoading && <Loader />}

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
                      ) : null}
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <span className="px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
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
                      </span>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-x-1">
                        <IconButton
                          type="button"
                          //   onClick={() => handleDeleteMaterial(product?.id)}
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
      </div>
    </>
  );
};

export default ProductCreationList;
