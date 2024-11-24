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
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Sales",
      data: [65, 59, 80, 81, 56, 55, 40, 101, 902],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const options = {
  plugins: {
    legend: {
      position: "right", // Change this to 'left', 'right', 'bottom' to position the legend
    },
  },
};

function IncomeAndOutcome() {
  return (
    <>
      <div>
        <Line options={options} data={data} height={50} />
      </div>
    </>
  );
}

export default IncomeAndOutcome;
