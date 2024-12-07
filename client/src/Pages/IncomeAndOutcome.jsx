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

const data = {
  labels: [
    "January",
    "February",
    "April",
    "June",
    "August",
    "October",
    "December",
  ],
  datasets: [
    {
      label: "Income",
      data: [65, 59, 80, 81, 56, 55, 40],
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

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
};

const IncomeAndOutcome = () => {
  const dateFilterMenu = () => {
    const currentDate = new Date(); // Tanggal sekarang

    const menu = [
      {
        label: "7 hari terakhir",
        value: "",
      },
      {
        label: "28 hari terakhir",
        value: "",
      },
      {
        label: "90 hari terakhir",
        value: "",
      },
      {
        label: "365 hari terakhir",
        value: "",
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

  console.log();

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
        />
      </div>

      <div>
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
