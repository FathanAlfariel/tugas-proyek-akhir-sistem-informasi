import DashboardStats from "../Components/DashboardStats";

const Dashboard = () => {
  return (
    <>
      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Dashboard
      </h1>

      <ul className="flex gap-x-6">
        <DashboardStats />

        {/* Notification */}
        <div></div>
      </ul>
    </>
  );
};

export default Dashboard;
