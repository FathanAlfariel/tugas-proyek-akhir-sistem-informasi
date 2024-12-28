import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import axios from "axios";

const DashboardStats = () => {
  const date = new Date();

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [order, setOrder] = useState(0);

  // Get income data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis/income?timePeriod=period-current_month`
      )
      .then(({ data }) => {
        for (const item of data?.results) {
          setIncome((prev) => (prev += item?.totalIncome));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get expense data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis/expense?timePeriod=period-current_month`
      )
      .then(({ data }) => {
        for (const item of data?.results) {
          setExpense((prev) => (prev += item?.totalExpense));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Get income data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis/order?timePeriod=period-current_month`
      )
      .then(({ data }) => {
        for (const item of data?.results) {
          setOrder((prev) => (prev += item?.totalOrders));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
              {income.toLocaleString("id", {
                style: "currency",
                currency: "IDR",
              })}
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
              {expense.toLocaleString("id", {
                style: "currency",
                currency: "IDR",
              })}
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

            <h2 className="mt-1 text-2xl font-medium text-nowrap">{order}</h2>
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
