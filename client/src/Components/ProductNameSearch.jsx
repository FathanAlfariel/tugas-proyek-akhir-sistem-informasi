import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const ProductNameSearch = () => {
  const parentRef = useRef(null);
  const productNameInput = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const [products, setIsProducts] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.firstEntries(searchParams.entries());

  const [productName, setProductName] = useState(
    currentParams?.productName || ""
  );

  // Get all products
  const fetchProducts = async () => {
    await axios
      .get("http://localhost:5000/api/product")
      .then(({ data }) => {
        // Get 3 random data
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
  }, []);

  console.log(products);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (parentRef.current && !parentRef.current.contains(event.target)) {
        setIsFocused(false); // Tutup elemen jika klik di luar elemen
      }
    };

    // Tambahkan event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup untuk menghapus event listener saat komponen tidak lagi digunakan
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={parentRef} className="static">
        <div
          onClick={() => {
            productNameInput.current?.focus();

            setIsFocused(true);
          }}
          className={`flex flex-col gap-y-0.5 ${
            isFocused ? "bg-zinc-100" : "hover:bg-zinc-100"
          } py-3 px-6 rounded-full cursor-pointer`}
        >
          <p className="text-xs font-semibold">Produk</p>

          <input
            ref={productNameInput}
            type="text"
            className="outline-none bg-transparent text-sm"
            placeholder="Cari berdasarkan nama produk"
          />
        </div>

        {isFocused && (
          <div className="w-3/12 absolute top-auto left-auto mt-3 z-[999]">
            <div className="py-3 bg-white shadow-lg rounded-2xl">
              {products?.length > 0 ? (
                <ul>
                  {products?.map((product, key) => {
                    return (
                      <li key={key}>
                        <button className="w-full text-left text-sm pl-4 pr-6 py-2 hover:bg-[#1D1B20]/[.08]">
                          {product.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm">Tidak ada produk</p>
              )}

              {products?.length > 0 && (
                <>
                  {/* Divider */}
                  <div className="w-full h-px bg-[#CAC4D0] my-3"></div>
                </>
              )}

              <ul>
                {products?.map((product, key) => {
                  return (
                    <li key={key}>
                      <Link to={`/products/${product?.id}`}>
                        <button className="flex items-center gap-x-4 w-full text-left text-sm pl-4 pr-6 py-2 hover:bg-[#1D1B20]/[.08]">
                          <img
                            src={`http://localhost:5000/public/images/${product?.images[0]?.name}`}
                            alt={product?.images[0]?.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />

                          <div className="flex flex-col gap-y-0.5">
                            <p className="text-sm line-clamp-1">
                              {product.name}
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
      </div>
    </>
  );
};

export default ProductNameSearch;
