import { useContext, useEffect, useState } from "react";
import { UserContext } from "../Config/UserConfig";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "./Loader";

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

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    setIsLoading(true);

    await axios
      .post("http://localhost:5000/api/auth/logout")
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

      <div id="user-menu" className="relative">
        <button
          onClick={handleShowMenu}
          className="p-1.5 rounded-full hover:bg-[#49454F]/[.08] active:[#49454F]/[.12] transition-all active:scale-90 duration-300"
        >
          <div className="w-7 h-7 flex justify-center items-center bg-[#6750A4] rounded-full">
            <p className="text-base font-medium uppercase text-white">
              {user?.data?.name[0]}
            </p>
          </div>
        </button>

        {showMenu && (
          <div className="absolute top-auto right-0 shadow bg-white min-w-64 py-2.5 rounded-xl mt-1 border border-[#F1F1F1] z-10">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-sm hover:bg-[#1D1B20]/[.08]"
                >
                  <span>
                    <MdLogout className="text-2xl" />
                  </span>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default UserMenu;
