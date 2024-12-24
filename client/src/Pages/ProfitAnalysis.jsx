import { IoIosArrowDown } from "react-icons/io";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DropdownSelect from "../Components/DropdownSelect";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Filter from "../Components/Filter";

// Register the components used
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Chart options
const options = {
  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: true, // Enable the tooltip
      mode: "index", // Set tooltip to show for all datasets on hover
      intersect: false, // Tooltip will appear when hovering over the chart, not just the points
      backgroundColor: "rgba(0, 0, 0, 0.7)", // Background color of the tooltip
      titleColor: "white", // Title text color
      bodyColor: "white", // Body text color
      borderColor: "rgba(255, 255, 255, 0.5)", // Border color
      borderWidth: 1, // Border width
      displayColors: false, // Do not show color indicators
      callbacks: {
        // Customizing the label
        label: (tooltipItem) => {
          const label = tooltipItem.dataset.label || "";
          const value = tooltipItem.raw;
          return `${label}: ${value.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          })}`; // Customize this line
        },
        // Customizing the title
        title: (tooltipItem) => {
          return `Tanggal: ${tooltipItem[0].label}`; // Customize this line
        },
      },
    },
    maintainAspectRatio: false, // Allow resizing independently of aspect ratio
    aspectRatio: 1,
  },
  //   scales: {
  //     y: {
  //       min: 0, // Mengatur nilai minimum sumbu Y
  //     },
  //   },
};

const ProfitAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [monthFilter, setMonthFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  const [chartLabel, setChartLabel] = useState([]);
  const [profitData, setProfitData] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const monthURLQuery = query.has("month");
    const yearURLQuery = query.has("year");
    const date = new Date();

    if (!monthURLQuery && !yearURLQuery) {
      navigate(
        `/admin/analysis/profit?month=${
          date.getMonth() + 1
        }&year=${date.getFullYear()}`
      );
    } else if (!monthURLQuery && yearURLQuery) {
      navigate(
        `/admin/analysis/profit?month=${
          date.getMonth() + 1
        }&year=${date.getFullYear()}`
      );
    } else if (monthURLQuery && !yearURLQuery) {
      navigate(
        `/admin/analysis/profit?month=${
          date.getMonth() + 1
        }&year=${date.getFullYear()}`
      );
    } else {
      navigate(`/admin/analysis/profit${location.search}`);
    }
  }, []);

  // Get income data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis/profit?${searchParams}`
      )
      .then(({ data }) => {
        setChartLabel(data?.results.map((item) => item?.week));
        setProfitData(data?.results.map((item) => item?.profit));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchParams]);

  // Date filter menu
  const dateFilterMenu = () => {
    const currentDate = new Date(); // Tanggal sekarang

    const menu = [
      {
        label: "Januari",
        value: 1,
        handleMenuClicked: () =>
          setSearchParams({ month: 1, year: currentDate.getFullYear() }),
      },
      {
        label: "Februari",
        value: 2,
        handleMenuClicked: () =>
          setSearchParams({ month: 2, year: currentDate.getFullYear() }),
      },
      {
        label: "Maret",
        value: 3,
        handleMenuClicked: () =>
          setSearchParams({ month: 3, year: currentDate.getFullYear() }),
      },
      {
        label: "April",
        value: 4,
        handleMenuClicked: () =>
          setSearchParams({ month: 4, year: currentDate.getFullYear() }),
      },
      {
        label: "Mei",
        value: 5,
        handleMenuClicked: () =>
          setSearchParams({ month: 5, year: currentDate.getFullYear() }),
      },
      {
        label: "Juni",
        value: 6,
        handleMenuClicked: () =>
          setSearchParams({ month: 6, year: currentDate.getFullYear() }),
      },
      {
        label: "Juli",
        value: 7,
        handleMenuClicked: () =>
          setSearchParams({ month: 7, year: currentDate.getFullYear() }),
      },
      {
        label: "Agustus",
        value: 8,
        handleMenuClicked: () =>
          setSearchParams({ month: 8, year: currentDate.getFullYear() }),
      },
      {
        label: "September",
        value: 9,
        handleMenuClicked: () =>
          setSearchParams({ month: 9, year: currentDate.getFullYear() }),
      },
      {
        label: "Oktober",
        value: 10,
        handleMenuClicked: () =>
          setSearchParams({ month: 10, year: currentDate.getFullYear() }),
      },
      {
        label: "November",
        value: 11,
        handleMenuClicked: () =>
          setSearchParams({ month: 11, year: currentDate.getFullYear() }),
      },
      {
        label: "Desember",
        value: 12,
        handleMenuClicked: () =>
          setSearchParams({ month: 12, year: currentDate.getFullYear() }),
      },
    ];

    return menu;
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "Order",
        data: profitData,
        fill: false,
        borderColor: "#4A90E2",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <div className="flex justify-end">
        {/* Custom date Filter */}
        <Filter
          id="custom-date-filter"
          headerTitle="Tanggal kustom"
          menuDirection="right"
          button={
            <button
              type="button"
              className="flex items-center gap-x-4 py-2 px-4 rounded-xl transition-all active:scale-90 duration-300 bg-transparent hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]"
            >
              <div className="flex flex-col items-start">
                <span className="text-xs text-[#606060]">
                  {currentParams.month && currentParams.year
                    ? Intl.DateTimeFormat("id", { month: "long" }).format(
                        new Date(currentParams.month)
                      ) +
                      " " +
                      currentParams.year
                    : "Kustom tanggal"}
                </span>
                <span className="text-sm">Kustom</span>
              </div>

              <span className="text-lg">
                <IoIosArrowDown />
              </span>
            </button>
          }
          onClick={() =>
            setSearchParams({
              month: monthFilter,
              year: yearFilter,
            })
          }
          disabledButton={
            monthFilter === "" && yearFilter === "" ? true : false
          }
        >
          <input
            id="month-filter"
            type="month"
            name="month-filter"
            className="w-full text-sm"
            defaultValue={`${currentParams.year}-${
              currentParams?.month?.length === 1
                ? `0${currentParams.month}`
                : currentParams.month
            }`}
            onChange={(e) => {
              const value = e.target.value;
              const month = value.split("-")[1];
              const year = value.split("-")[0];

              month.startsWith("0")
                ? setMonthFilter(month.split("")[1])
                : setMonthFilter(month);

              setYearFilter(year);
            }}
          />
        </Filter>

        {/* Date Filter */}
        <DropdownSelect
          id="date-filter"
          menuDirection="right"
          button={
            <button
              type="button"
              className="flex items-center gap-x-4 py-2 px-4 rounded-xl transition-all active:scale-90 duration-300 bg-transparent hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]"
            >
              <div className="flex flex-col items-start gap-y-0.5">
                <span className="text-xs text-[#606060]">Pilih bulan</span>
                <span className="text-sm">
                  {(() => {
                    const monthArray = [
                      "Januari",
                      "Februari",
                      "Maret",
                      "April",
                      "Mei",
                      "Juni",
                      "Juli",
                      "Agustus",
                      "September",
                      "Oktober",
                      "November",
                      "Desember",
                    ];
                    const month = parseInt(currentParams?.month);

                    return monthArray[month - 1];
                  })()}
                </span>
              </div>

              <span className="text-lg">
                <IoIosArrowDown />
              </span>
            </button>
          }
          selectMenu={dateFilterMenu()}
          defaultValue={parseInt(currentParams?.month)}
        />
      </div>

      <div className="mt-4">
        <div className="block lg:hidden">
          <Line options={options} data={data} height={250} />
        </div>

        <div className="hidden lg:block">
          <Line options={options} data={data} height={105} />
        </div>
      </div>
    </>
  );
};

export default ProfitAnalysis;
