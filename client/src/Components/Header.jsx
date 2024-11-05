import IconButton from "./IconButton";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { FaRegBell } from "react-icons/fa6";

const Header = () => {
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="hidden md:block col-span-3 lg:col-span-4">Hello</div>
        <div className="col-span-8 md:col-span-6 lg:col-span-4">
          <Search />
        </div>

        <div className="col-span-3 lg:col-span-4">
          <div className="flex items-center gap-x-1.5 justify-end items-center h-full">
            <IconButton>
              <FaRegBell />
            </IconButton>
            <UserMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
