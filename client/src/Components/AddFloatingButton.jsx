import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const AddFloatingButton = () => {
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // Closes the menu when the user clicks outside the div
  useEffect(() => {
    if (showMenu) {
      window.addEventListener("click", (e) => {
        if (
          !document.getElementById("floating-button-menu").contains(e.target)
        ) {
          setShowMenu(false);
        }
      });
    }
  }, [showMenu]);

  // Define paths where the floating button should not appear
  const hideButtonOnPaths = ["/admin/product/add", "/admin/product/edit/"];

  // Check if the current location is in the list
  const shouldHideButton = hideButtonOnPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  // Render button only if it should not be hidden on the current path
  if (shouldHideButton) return null;

  return (
    <>
      {/* Add Floating Button  */}
      <div className="fixed bottom-20 right-20">
        <div id="floating-button-menu" className="relative">
          <button
            onClick={handleShowMenu}
            className="group bg-[#EADDFF] text-[#21005D] text-sm font-medium rounded-2xl overflow-hidden transition-all active:scale-90 duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center gap-x-3 pl-4 pr-5 py-4 transition-all duration-300 group-hover:bg-[#21005D]/[.08]">
              <span>
                <LuPlus className="text-2xl" />
              </span>
              Tambah
            </div>
          </button>

          {showMenu && (
            <div className="min-w-56 absolute bottom-full right-0 mb-1 rounded-xl bg-white shadow-md py-2.5 border border-[#F1F1F1]">
              <ul>
                <li>
                  <Link to={"/admin/product/add"}>
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                    >
                      Tambah produk
                    </button>
                  </Link>
                </li>
                <li>
                  <button className="w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]">
                    Tambah pesanan
                  </button>
                </li>
                <li>
                  <button className="w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]">
                    Tambah pengeluaran
                  </button>
                </li>
                <li>
                  <button className="w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]">
                    Tambah penjahit
                  </button>
                </li>
                <li>
                  <button className="w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]">
                    Tambah pembuatan produk
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddFloatingButton;
