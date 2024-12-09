import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Config/UserConfig";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";
import Dropdown from "./Dropdown";
import { IoChevronBack } from "react-icons/io5";

const UserMenu = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);

  // Closes the menu when the user clicks outside the div
  useEffect(() => {
    if (showMenu) {
      window.addEventListener("click", (e) => {
        if (!document.getElementById("user-menu").contains(e.target)) {
          setShowMenu(false);
        }
      });
    }
  }, [showMenu]);

  const handleLogout = async () => {
    setIsLoading(true);

    await axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`)
      .then(({ data }) => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loader />}

      <Dropdown
        id="user-menu"
        minWidth="min-w-64"
        menuTopOrBottom="top-auto"
        menuDirection="right"
        button={
          <button
            type="button"
            className="p-1.5 rounded-full hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] transition-all active:scale-90 duration-300"
          >
            <div className="w-7 h-7 flex justify-center items-center bg-[#6750A4] rounded-full">
              <p className="text-base font-medium uppercase text-white">
                {user?.data?.name[0]}
              </p>
            </div>
          </button>
        }
        selectMenu={[
          {
            icon: <IoChevronBack />,
            label: "Kembali ke halaman utama",

            handleMenuClicked: () => navigate("/"),
          },
          {
            icon: <MdLogout />,
            label: "Logout",

            handleMenuClicked: handleLogout,
          },
        ]}
      />
    </>
  );
};

export default UserMenu;
