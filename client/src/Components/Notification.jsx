import axios from "axios";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";

const Notification = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [products, setProducts] = useState([]);

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

  return (
    <>
      {isLoading && <Loader />}

      <li className="min-w-full md:min-w-96 py-4 px-5 border border-black/[.1] rounded-2xl">
        <h5 className="text-lg font-semibold">Notifikasi</h5>

        <div className="mt-5">
          <ul className="flex flex-col gap-y-4">
            {products?.map((prod) =>
              prod?.variants.map((variant, key) => (
                <li
                  title={`Stok produk tersisa ${variant?.stock}. Silahkan tambah stok produk`}
                  key={key}
                  className="flex items-start gap-x-2"
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
          </ul>
        </div>
      </li>
    </>
  );
};

export default Notification;
