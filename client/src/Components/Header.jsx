import IconButton from "./IconButton";
import Navigation from "./Navigation";
import UserMenu from "./UserMenu";
import { FaRegBell } from "react-icons/fa6";

const Header = () => {
  return (
    <>
      <div className="flex flex-wrap justify-between items-center">
        <div className="">Hello</div>

        <div className="order-last lg:order-none overflow-x-auto">
          <Navigation />
        </div>

        <div className="flex items-center gap-x-1.5 justify-end items-center h-full">
          <IconButton type="button" buttonType="icon">
            <FaRegBell />
          </IconButton>
          <UserMenu />
        </div>
      </div>
    </>
  );
};

export default Header;
