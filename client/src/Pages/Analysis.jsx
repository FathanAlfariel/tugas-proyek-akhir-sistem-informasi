import React from "react";
import Tabs from "../Components/Tabs";
import IncomeAndOutcome from "./IncomeAndOutcome";

const Analysis = () => {
  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">Analisis</h1>

      <div>
        <Tabs
          menu={[
            {
              label: "Pemasukan & pengeluaran",
              content: <IncomeAndOutcome />,
            },
            { label: "Laba", content: "Laba" },
            { label: "Pembelian", content: "Pembelian" },
          ]}
        />
      </div>
    </>
  );
};

export default Analysis;
