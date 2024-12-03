import React from "react";
import { Outlet } from "react-router-dom";
import HomePageHeader from "./Components/HomePageHeader";

const Layout = () => {
  return (
    <>
      {/* Header */}
      <HomePageHeader />

      <main className="md:mx-6 mt-6 mb-8">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
