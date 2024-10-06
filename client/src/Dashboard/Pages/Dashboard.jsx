const Dashboard = () => {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="">
          <ul className="flex items-center gap-x-2 border">
            <li>Overview</li>
            <li>Analytics</li>
            <li>Reports</li>
            <li>Notifications</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
