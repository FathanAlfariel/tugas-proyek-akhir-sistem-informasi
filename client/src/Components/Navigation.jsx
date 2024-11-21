import React from "react";
import {
  RiDashboardLine,
  RiDashboardFill,
  RiFileList2Line,
  RiFileList2Fill,
} from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { VscGraphLine } from "react-icons/vsc";
import { MdOutlineShoppingBag, MdShoppingBag } from "react-icons/md";
import { LuMinus } from "react-icons/lu";
import { PiYarn, PiYarnFill } from "react-icons/pi";
import { IoBagAddOutline, IoBagAdd } from "react-icons/io5";

const Navigation = () => {
  const menu = [
    {
      icon: <RiDashboardLine />,
      iconSelected: <RiDashboardFill />,
      label: "Dashboard",
      link: "/admin",
      end: true,
    },
    {
      icon: <VscGraphLine />,
      iconSelected: <VscGraphLine className="stroke-1" />,
      label: "Analisis",
      link: "/admin/analysis",
      end: true,
    },
    {
      icon: <MdOutlineShoppingBag />,
      iconSelected: <MdShoppingBag />,
      label: "Produk",
      link: "/admin/product",
      end: false,
    },
    {
      icon: <RiFileList2Line />,
      iconSelected: <RiFileList2Fill />,
      label: "Pemesanan",
      link: "/admin/order",
      end: false,
    },
    {
      icon: <LuMinus />,
      iconSelected: <LuMinus />,
      label: "Pengeluaran",
      link: "/admin/expense",
      end: false,
    },
    {
      icon: <PiYarn />,
      iconSelected: <PiYarnFill />,
      label: "Penjahit",
      link: "/admin/tailor",
      end: false,
    },
    {
      icon: <IoBagAddOutline />,
      iconSelected: <IoBagAdd />,
      label: "Pembuatan produk",
      link: "/admin/make-product",
      end: true,
    },
  ];

  return (
    <>
      <div className="overflow-x-auto">
        <ul className="flex items-center gap-x-2">
          {menu.map((item, key) => {
            return (
              <li key={key}>
                <NavLink
                  to={item.link}
                  className="group relative"
                  end={item.end}
                >
                  {({ isActive }) => (
                    <>
                      <div className="transition-all active:scale-90 flex items-center gap-x-2 px-4 py-4 text-sm font-medium duration-300 text-nowrap ">
                        <span className="text-lg">
                          {isActive ? item.iconSelected : item.icon}
                        </span>
                        {item.label}
                      </div>

                      {isActive ? (
                        <div className="absolute bottom-0 left-0 w-full border-2 border-[#6750A4] rounded-t-full"></div>
                      ) : (
                        <div className="hidden group-hover:block absolute bottom-0 left-0 w-full border-2 rounded-t-full bg-[#49454F]/[.08]"></div>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Navigation;
