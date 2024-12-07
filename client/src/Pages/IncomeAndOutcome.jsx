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
  plugins,
} from "chart.js";
import DropdownSelect from "../Components/DropdownSelect";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

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
  },
};

const IncomeAndOutcome = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [chartLabel, setChartLabel] = useState([]);
  const [incomeData, setIncomeData] = useState([]);

  useEffect(() => {
    // Mengecek apakah sudah ada query di URL
    const searchParams = new URLSearchParams(location.search);

    // Jika tidak ada query tertentu, set query default
    if (!searchParams.has("timePeriod")) {
      searchParams.set("timePeriod", "1-week-period"); // Menambahkan query default
      setSearchParams({ timePeriod: "1-week-period" });
    }
  }, [location]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/analysis/income?${searchParams}`)
      .then(({ data }) => {
        setChartLabel(data?.results.map((item) => item?.date));
        setIncomeData(data?.results.map((item) => item?.totalIncome));
        console.log(data);
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
        label: "7 hari terakhir",
        value: "1-week-period",
        handleMenuClicked: () =>
          setSearchParams({ timePeriod: "1-week-period" }),
      },
      {
        label: "28 hari terakhir",
        value: "4-week-period",
        handleMenuClicked: () =>
          setSearchParams({ timePeriod: "4-week-period" }),
      },
      {
        label: "90 hari terakhir",
        value: "90-days-period",
        handleMenuClicked: () =>
          setSearchParams({ timePeriod: "90-days-period" }),
      },
      {
        label: "365 hari terakhir",
        value: "1-year-period",
        handleMenuClicked: () =>
          setSearchParams({ timePeriod: "1-year-period" }),
      },
      { divider: true },
    ];

    for (let i = 1; i <= 3; i++) {
      const tempDate = new Date(currentDate);

      tempDate.setMonth(tempDate.getMonth() - i);

      menu.push({
        label: tempDate.toLocaleString("default", {
          month: "long",
        }),
        value: "",
      });
    }

    menu.push(
      { divider: true },
      {
        label: "Kustom",
        value: "",
      }
    );

    return menu;
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "Income",
        data: incomeData,
        fill: false,
        borderColor: "rgb(85, 195, 100)",
        tension: 0.1,
      },
      {
        label: "Outcome",
        data: [43, 65, 12, 75, 32, 67, 74],
        fill: false,
        borderColor: "rgb(255, 99, 132)",
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <div className="flex justify-end">
        <DropdownSelect
          id="date-filter"
          menuDirection="right"
          button={
            <button
              type="button"
              className="flex items-center gap-x-4 py-2 px-4 rounded-xl transition-all active:scale-90 duration-300 bg-transparent hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]"
            >
              <div className="flex flex-col">
                <span className="text-xs text-[#606060]">Nov 1 – 30, 2024</span>
                <span className="text-sm">7 hari terakhir</span>
              </div>

              <span className="text-lg">
                <IoIosArrowDown />
              </span>
            </button>
          }
          selectMenu={dateFilterMenu()}
          defaultValue={currentParams?.timePeriod}
        />
      </div>

      <div className="flex flex-col gap-y-0.5 mt-4">
        {/* Indicator */}
        <div className="flex justify-end items-center gap-x-3">
          <div className="flex items-center gap-x-1.5">
            <div className="h-2 w-2 rounded-full bg-[rgb(85,195,100)]"></div>
            <span className="text-sm">Pemasukan</span>
          </div>
          <div className="flex items-center gap-x-1.5">
            <div className="h-2 w-2 rounded-full bg-[rgb(255,99,132)]"></div>
            <span className="text-sm">Pengeluaran</span>
          </div>
        </div>

        <Line options={options} data={data} height={50} />
      </div>
    </>
  );
};

export default IncomeAndOutcome;
