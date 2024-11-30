import React from "react";
import Tabs from "../Components/Tabs";
import Material from "./Material";
import ProductCreationList from "./ProductCreationList";

const ProductCreation = () => {
  return (
    <>
      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Pembuatan produk
      </h1>

      <Tabs
        menu={[
          { label: "Bahan-bahan", content: <Material /> },
          { label: "Produk", content: <ProductCreationList /> },
        ]}
      />
    </>
  );
};

export default ProductCreation;
