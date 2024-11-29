import React from "react";
import Tabs from "../Components/Tabs";
import Material from "./Material";
import ProductCreationList from "./ProductCreationList";

const ProductCreation = () => {
  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Pembuatan produk</h1>

      <div>
        <Tabs
          menu={[
            { label: "Bahan-bahan", content: <Material /> },
            { label: "Produk", content: <ProductCreationList /> },
          ]}
        />
      </div>
    </>
  );
};

export default ProductCreation;
