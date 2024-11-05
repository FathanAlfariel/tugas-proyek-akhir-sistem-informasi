import { Outlet } from "react-router-dom";
import Header from "./Components/Header";
import AddFloatingButton from "./Components/AddFloatingButton";
import Navigation from "./Components/Navigation";

const Layout = () => {
  return (
    <>
      <header className="mx-6 mt-2.5">
        {/* Dashboard header */}
        <Header />

        <div className="flex justify-between items-center mt-6">
          <Navigation />
          <AddFloatingButton />
        </div>
      </header>

      <main className="mx-6 mt-6 mb-8">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
