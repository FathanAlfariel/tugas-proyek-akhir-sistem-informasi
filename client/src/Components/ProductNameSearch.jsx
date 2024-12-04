import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { Link, useSearchParams } from "react-router-dom";

const ProductNameSearch = ({ showProductFilter }) => {
  const [products, setIsProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [productName, setProductName] = useState(currentParams?.title || "");

  // Get all products
  const fetchProducts = async () => {
    await axios
      .get(`http://localhost:5000/api/product?title=${productName}`)
      .then(({ data }) => {
        const shuffled = [...data.results].sort(() => 0.5 - Math.random()); // Acak array
        const selected = shuffled.slice(0, 3); // Ambil 3 data pertama
        setIsProducts(selected);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Get all products
  useEffect(() => {
    fetchProducts();
  }, [productName]);

  return (
    <>
      {showProductFilter && (
        <div className="pb-4 px-4">
          {/* Search input */}
          <div className="flex items-center gap-x-2 border rounded-lg p-2 mt-1">
            <span className="text-xl">
              <IoIosSearch />
            </span>

            <input
              type="text"
              name="product_name"
              className="outline-none bg-transparent text-sm w-full"
              placeholder="Cari berdasarkan nama produk"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Product list */}
          <div className="mt-2 max-h-56 overflow-y-auto">
            {products?.length > 0 ? (
              <ul className="flex flex-col gap-y-0.5">
                {products?.map((product, key) => {
                  return (
                    <li key={key}>
                      <button
                        type="button"
                        className="w-full text-left text-sm pl-4 pr-6 py-2 hover:bg-[#1D1B20]/[.08] rounded-md"
                        onClick={() => {
                          setSearchParams({
                            ...currentParams,
                            title: product?.name,
                          });
                          setProductName(product?.name);

                          setIsFocused(false);
                        }}
                      >
                        {product.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-[#606060] text-center">
                Tidak ada produk
              </p>
            )}

            {products?.length > 0 && (
              <>
                {/* Divider */}
                <div className="w-full h-px bg-[#CAC4D0] my-2"></div>
              </>
            )}

            <ul className="flex flex-col gap-y-0.5">
              {products?.map((product, key) => {
                return (
                  <li key={key}>
                    <Link to={`/products/${product?.id}`}>
                      <button
                        type="button"
                        className="flex items-center gap-x-4 w-full text-left text-sm pl-4 pr-6 py-2 hover:bg-[#1D1B20]/[.08] rounded-md"
                      >
                        <img
                          src={`http://localhost:5000/public/images/${product?.images[0]?.name}`}
                          alt={product?.images[0]?.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />

                        <div className="flex flex-col gap-y-0.5">
                          <p className="text-sm line-clamp-1">
                            {product?.name}
                          </p>
                          <p className="text-sm text-[#6A6A6A] line-clamp-1">
                            Warna:{" "}
                            {product?.variants?.map((item, key) => (
                              <span key={key}>
                                {item.color}
                                {key !== product.variants.length - 1
                                  ? ", "
                                  : ""}
                              </span>
                            ))}
                          </p>
                        </div>
                      </button>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductNameSearch;
