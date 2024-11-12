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

        <div className="mt-6">
          <Navigation />
        </div>
      </header>

      <main className="mx-6 my-8 h-full">
        <Outlet />
        <AddFloatingButton />
      </main>
    </>
  );
};

export default Layout;
