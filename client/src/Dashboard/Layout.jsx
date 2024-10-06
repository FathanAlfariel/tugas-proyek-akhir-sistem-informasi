import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import AddFloatingButton from "./Components/AddFloatingButton";

const Layout = () => {
  return (
    <>
      {/* Dashboard header */}
      <Header />

      <main className="p-8 pt-6">
        <Outlet />
        <AddFloatingButton />
      </main>
    </>
  );
};

export default Layout;
