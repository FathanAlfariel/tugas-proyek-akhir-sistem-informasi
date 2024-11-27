import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Components/Loader";
import { Link } from "react-router-dom";
import Carousel from "../Components/Carousel";

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
          setProductList(data.results);
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
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-5">
          {productList?.map((product, key) => {
            return (
              <li key={key}>
                <Link to={`/products/${product?.id}`}>
                  <Carousel
                    images={product.images}
                    className="min-w-full h-48 md:h-56 lg:h-60 object-cover"
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
