import React from "react";
import { Outlet } from "react-router-dom";
import HomePageHeader from "./Components/HomePageHeader";

const Layout = () => {
  return (
    <>
      {/* Header */}
      <header className="sticky top-0 left-0 bg-white py-3 mx-4 md:mx-6 z-10">
        <HomePageHeader />
      </header>

      <main className="mx-4 md:mx-6 mt-6 mb-8">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
