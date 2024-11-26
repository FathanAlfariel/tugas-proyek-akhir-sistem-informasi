import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);

  // Get all products
  useEffect(() => {
    setIsLoading(true);

    const fetchProducts = async () => {
      await axios
        .get("http://localhost:5000/api/product")
        .then(({ data }) => {
          const apiData = data.results;

          for (let i = 0; i <= 100; i++) {
            setProductList((prev) => [...prev, ...apiData]);
          }
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

  console.log(productList);

  return (
    <>
      {isLoading && <Loader />}

      <div className="mx-4 md:mx-6 mt-5 mb-8">
        <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {productList?.map((product, key) => {
            return (
              <li key={key}>
                <Link to="/">
                  <img
                    src={`http://localhost:5000/public/images/${product?.images[0]?.name}`}
                    alt={product?.images[0]?.name}
                    className="w-full h-72 md:h-56 lg:h-64 rounded-xl object-cover"
                  />

                  <div className="flex flex-col gap-y-0.5 mt-2.5">
                    <h5 className="text-sm font-medium line-clamp-2">
                      {product?.name}
                    </h5>
                    <p className="text-sm text-[#6A6A6A] line-clamp-2">
                      Warna:{" "}
                      {product?.variants?.map((item, key) => (
                        <span key={key}>
                          {item.color}
                          {key !== product.variants.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                    <p className="text-sm text-[#6A6A6A] line-clamp-2">
                      500+ terjual
                    </p>
                  </div>
                  <p className="text-sm font-medium line-clamp-1 mt-1.5">
                    {(() => {
                      // Minimum price
                      const minPrice = Math.min(
                        ...product?.variants?.map((item) => item.price)
                      );

                      // Maximum price
                      const maxPrice = Math.max(
                        ...product?.variants?.map((item) => item.price)
                      );

                      return `${minPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })} - ${maxPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}`;
                    })()}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default HomePage;
