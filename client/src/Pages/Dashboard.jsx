import DashboardStats from "../Components/DashboardStats";
import Notification from "../Components/Notification";

const Dashboard = () => {
  return (
    <>
      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Dashboard
      </h1>

      <ul className="flex gap-x-6">
        {/* Dashboard Stats */}
        <DashboardStats />

        {/* Notification */}
        <Notification />
      </ul>
    </>
  );
};

export default Dashboard;
