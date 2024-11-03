import IconButton from "./IconButton";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { FaRegBell } from "react-icons/fa6";

const Header = () => {
  return (
    <>
      <div className="grid grid-cols-11">
        <div className="col-span-4">Hello</div>
        <div className="col-span-3">
          <Search />
        </div>

        <div className="col-span-4">
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
