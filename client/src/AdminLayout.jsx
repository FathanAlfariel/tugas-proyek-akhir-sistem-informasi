import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import AddFloatingButton from "./Components/AddFloatingButton";

const AdminLayout = () => {
  return (
    <>
      <header className="mx-4 md:mx-6 mt-2.5">
        {/* Dashboard header */}
        <Header />
      </header>

      <main className="mx-4 md:mx-6 mt-5 mb-8">
        <Outlet />
        <AddFloatingButton />
      </main>
    </>
  );
};

export default AdminLayout;
