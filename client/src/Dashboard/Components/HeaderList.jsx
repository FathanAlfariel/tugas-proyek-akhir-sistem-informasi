import React from "react";
import Button from "./Button";

const HeaderList = () => {
  return (
    <>
      <ul className="flex items-center gap-x-2">
        {/* Overview */}
        <li>
          <Button className="px-3 py-2.5 text-sm font-medium rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            Overview
          </Button>
        </li>
        {/* Customers */}
        <li>
          <Button className="px-3 py-2.5 text-sm font-medium rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            Customers
          </Button>
        </li>
        {/* Products */}
        <li>
          <Button className="px-3 py-2.5 text-sm font-medium rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            Products
          </Button>
        </li>
        {/* Settings */}
        <li>
          <Button className="px-3 py-2.5 text-sm font-medium rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            Settings
          </Button>
        </li>
      </ul>
    </>
  );
};

export default HeaderList;
