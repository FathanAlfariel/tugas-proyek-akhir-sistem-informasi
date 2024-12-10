import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const Analysis = () => {
  const location = useLocation();
  const pathname = location.pathname.split("/");

  const [isSelected, setIsSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname.split("/");
    const query = new URLSearchParams(location.search);
    const timePeriodURLQuery = query.has("timePeriod");
    const startDateURLQuery = query.has("startDate");
    const endDateURLQuery = query.has("endDate");

    if (pathname[3] === undefined && !timePeriodURLQuery) {
      navigate("/admin/analysis/income-outcome?timePeriod=1-week-period");
    } else if (
      pathname[3] &&
      !timePeriodURLQuery &&
      startDateURLQuery &&
      endDateURLQuery
    ) {
      navigate(`/admin/analysis/income-outcome${location.search}`);
    } else if (pathname[3] && !timePeriodURLQuery) {
      navigate("/admin/analysis/income-outcome?timePeriod=1-week-period");
    } else if (pathname[3] && timePeriodURLQuery) {
      navigate(`/admin/analysis/income-outcome${location.search}`);
    } else {
      navigate("/admin/analysis/income-outcome?timePeriod=1-week-period");
    }
  }, []);

  useEffect(() => {
    if (pathname[3] === "income-outcome") {
      setIsSelected("income-outcome");
    } else if (pathname[3] === "profit") {
      setIsSelected("profit");
    } else if (pathname[3] === "purchase") {
      setIsSelected("purchase");
    }
  }, [pathname]);

  // Handle ketika item dipilih
  const handleIsSelected = (key) => {
    setIsSelected(key);

    // Menavigasi ke URL yang sesuai berdasarkan key
    if (key === "income-outcome") {
      navigate("/admin/analysis/income-outcome");
    } else if (key === "profit") {
      navigate("/admin/analysis/profit");
    } else if (key === "purchase") {
      navigate("/admin/analysis/purchase");
    }
  };

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">Analisis</h1>

      <ul className="flex items-center gap-x-4 border-b overflow-x-auto">
        <li className="group relative">
          <button
            type="button"
            onClick={() => handleIsSelected("income-outcome")}
            className={`flex items-center gap-x-2 px-4 py-4 text-sm font-medium ${
              isSelected === "income-outcome"
                ? "text-[#6750A4] hover:text-[#6750A4]"
                : "text-[#5F6368] hover:text-[#6750A4]"
            } transition-all active:scale-90 duration-300 text-nowrap`}
          >
            Pemasukan & Pengeluaran
          </button>
          {isSelected === "income-outcome" ? (
            <div className="absolute bottom-0 left-0 w-full border-2 border-[#6750A4] rounded-t-full"></div>
          ) : (
            <div className="hidden group-hover:block absolute bottom-0 left-0 w-full border-2 rounded-t-full bg-[#49454F]/[.08]"></div>
          )}
        </li>

        <li className="group relative">
          <button
            type="button"
            onClick={() => handleIsSelected("profit")}
            className={`flex items-center gap-x-2 px-4 py-4 text-sm font-medium ${
              isSelected === "profit"
                ? "text-[#6750A4] hover:text-[#6750A4]"
                : "text-[#5F6368] hover:text-[#6750A4]"
            } transition-all active:scale-90 duration-300 text-nowrap`}
          >
            Laba
          </button>
          {isSelected === "profit" ? (
            <div className="absolute bottom-0 left-0 w-full border-2 border-[#6750A4] rounded-t-full"></div>
          ) : (
            <div className="hidden group-hover:block absolute bottom-0 left-0 w-full border-2 rounded-t-full bg-[#49454F]/[.08]"></div>
          )}
        </li>

        <li className="group relative">
          <button
            type="button"
            onClick={() => handleIsSelected("purchase")}
            className={`flex items-center gap-x-2 px-4 py-4 text-sm font-medium ${
              isSelected === "purchase"
                ? "text-[#6750A4] hover:text-[#6750A4]"
                : "text-[#5F6368] hover:text-[#6750A4]"
            } transition-all active:scale-90 duration-300 text-nowrap`}
          >
            Pembelian
          </button>
          {isSelected === "purchase" ? (
            <div className="absolute bottom-0 left-0 w-full border-2 border-[#6750A4] rounded-t-full"></div>
          ) : (
            <div className="hidden group-hover:block absolute bottom-0 left-0 w-full border-2 rounded-t-full bg-[#49454F]/[.08]"></div>
          )}
        </li>
      </ul>

      <div className="py-3 w-full">
        {/* Outlet untuk menampilkan komponen yang sesuai */}
        <Outlet />
      </div>
    </>
  );
};

export default Analysis;
