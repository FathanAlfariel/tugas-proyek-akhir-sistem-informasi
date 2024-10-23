import Button from "./Button";

const AddFloatingButton = () => {
  return (
    <>
      {/* Add Floating Button  */}
      <div className="fixed bottom-20 right-20">
        <Button className="pl-4 pr-5 py-4 flex items-center gap-x-3 rounded-2xl text-sm font-medium bg-blue-300 shadow-md hover:shadow-lg">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
          </span>
          Tambah
        </Button>
      </div>
    </>
  );
};

export default AddFloatingButton;
