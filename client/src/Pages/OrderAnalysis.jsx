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
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
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
    },
    maintainAspectRatio: false, // Allow resizing independently of aspect ratio
    aspectRatio: 1,
  },
  scales: {
    y: {
      min: 0, // Mengatur nilai minimum sumbu Y
    },
  },
};

const OrderAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [chartLabel, setChartLabel] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const timePeriodURLQuery = query.has("timePeriod");
    const startDateURLQuery = query.has("startDate");
    const endDateURLQuery = query.has("endDate");

    if (!timePeriodURLQuery && !startDateURLQuery && !endDateURLQuery) {
      navigate("/admin/analysis/order?timePeriod=1-week-period");
    } else if (!timePeriodURLQuery && startDateURLQuery && endDateURLQuery) {
      navigate(`/admin/analysis/order${location.search}`);
    } else if (!timePeriodURLQuery) {
      navigate("/admin/analysis/order?timePeriod=1-week-period");
    } else if (timePeriodURLQuery) {
      navigate(`/admin/analysis/order${location.search}`);
    } else {
      navigate("/admin/analysis/order?timePeriod=1-week-period");
    }
  }, []);

  // Get income data
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/analysis/order?${searchParams}`
      )
      .then(({ data }) => {
        setChartLabel(data?.results.map((item) => item?.date));
        setOrderData(data?.results.map((item) => item?.totalOrders));
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

    for (let i = 0; i <= 2; i++) {
      const tempDate = new Date(currentDate);

      tempDate.setMonth(tempDate.getMonth() - i);

      menu.push({
        label: tempDate.toLocaleString("default", {
          month: "long",
        }),
        value: `${
          i === 0 ? "period-current_month" : `period-minus_${i}_month`
        }`,
        handleMenuClicked: () =>
          setSearchParams({
            timePeriod: `${
              i === 0 ? "period-current_month" : `period-minus_${i}_month`
            }`,
          }),
      });
    }

    return menu;
  };

  const data = {
    labels: chartLabel,
    datasets: [
      {
        label: "Order",
        data: orderData,
        fill: false,
        borderColor: "#4A90E2",
        tension: 0.1,
      },
    ],
  };

  const [dateRange, setDateRange] = useState([]);
  const startDate = dateRange.length > 0 && new Date(dateRange[0]);
  const endDate = dateRange.length > 1 && new Date(dateRange[1]);

  const formattedStartDate =
    dateRange.length > 0 &&
    `${startDate?.getFullYear()}-${(startDate?.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${startDate?.getDate().toString().padStart(2, "0")}`;
  const formattedEndDate =
    dateRange.length > 1 &&
    `${endDate?.getFullYear()}-${(endDate?.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${endDate?.getDate().toString().padStart(2, "0")}`;
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
                  {currentParams.startDate && currentParams.endDate
                    ? currentParams.startDate + " - " + currentParams.endDate
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
              startDate: formattedStartDate,
              endDate: formattedEndDate,
            })
          }
          disabledButton={dateRange.length === 0 ? true : false}
        >
          <DateRangePicker
            calendarIcon={null}
            onChange={setDateRange}
            value={dateRange}
            locale={"id-ID"}
            clearIcon={null}
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
                <span className="text-xs text-[#606060]">
                  {currentParams.timePeriod
                    ? chartLabel[0] + " - " + chartLabel[chartLabel.length - 1]
                    : "Pilih tanggal"}
                </span>
                <span className="text-sm">
                  {currentParams.timePeriod === "1-week-period"
                    ? "7 hari terakhir"
                    : currentParams.timePeriod === "4-week-period"
                    ? "28 hari terakhir"
                    : currentParams.timePeriod === "90-days-period"
                    ? "90 hari terakhir"
                    : currentParams.timePeriod === "1-year-period"
                    ? "365 hari terakhir"
                    : "Pilih tanggal"}
                </span>
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

export default OrderAnalysis;
