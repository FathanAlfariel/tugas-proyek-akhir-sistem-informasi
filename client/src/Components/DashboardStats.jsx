import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const DashboardStats = () => {
  const date = new Date();

  return (
    <>
      <li className="min-w-full md:min-w-80 py-4 px-5 border border-black/[.1] rounded-2xl">
        <h5 className="text-lg font-semibold">Analysis Toko</h5>

        <div className="flex flex-col divide-y mt-5">
          {/* Income */}
          <div className="pb-6">
            <p className="text-sm">
              Total pemasukan{" "}
              <span className="before:content-['('] after:content-[')']">
                {date.toLocaleDateString("id", { month: "long" })}
              </span>
            </p>

            <h2 className="mt-1 text-2xl font-medium text-nowrap">
              Rp 1.000.000
            </h2>
          </div>

          {/* Outcome */}
          <div className="py-6">
            <p className="text-sm">
              Total pengeluaran{" "}
              <span className="before:content-['('] after:content-[')']">
                {date.toLocaleDateString("id", { month: "long" })}
              </span>
            </p>

            <h2 className="mt-1 text-2xl font-medium text-nowrap">
              Rp 1.000.000
            </h2>
          </div>

          {/* Customer */}
          <div className="pt-6">
            <p className="text-sm">
              Total pembeli{" "}
              <span className="before:content-['('] after:content-[')']">
                {date.toLocaleDateString("id", { month: "long" })}
              </span>
            </p>

            <h2 className="mt-1 text-2xl font-medium text-nowrap">100</h2>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/admin/analysis">
            <Button type="button" buttonStyle="tonal-button">
              Pergi ke halaman analisis
            </Button>
          </Link>
        </div>
      </li>
    </>
  );
};

export default DashboardStats;
