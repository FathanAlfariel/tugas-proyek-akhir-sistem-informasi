import HeaderList from "./HeaderList";
import UserMenu from "./UserMenu";

const Header = () => {
  return (
    <>
      <header className="flex justify-between items-center border px-4 py-2">
        {/* Header List */}
        <HeaderList />

        {/* User Menu */}
        <UserMenu />
      </header>
    </>
  );
};

export default Header;
