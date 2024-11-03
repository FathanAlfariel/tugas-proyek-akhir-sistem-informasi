const Button = ({ type, buttonStyle, width = "auto", children, onClick }) => {
  return (
    <>
      {buttonStyle === "filled" ? (
        <button
          type={type}
          className={`${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-6 text-sm text-white font-medium rounded-full transition-all active:scale-90 duration-300 bg-[#6750A4] shadow-none hover:shadow-md`}
          onClick={onClick}
        >
          {children}
        </button>
      ) : (
        "Hello"
      )}
    </>
  );
};

export default Button;
