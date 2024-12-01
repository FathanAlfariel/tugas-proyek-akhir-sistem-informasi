import axios from "axios";
import React, { useEffect, useRef, useState } from "react";

const ProductNameSearch = () => {
  const parentRef = useRef(null);
  const productNameInput = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const [products, setIsProducts] = useState([]);

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
          <div className="absolute top-auto left-auto mt-3 border">
            <div className="bg-white">Hai</div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductNameSearch;
