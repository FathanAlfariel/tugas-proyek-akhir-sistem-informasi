const Button = ({
  type,
  buttonStyle,
  width = "auto",
  icon,
  children,
  onClick,
  title,
}) => {
  return (
    <>
      {buttonStyle === "filled" ? (
        <button
          title={title}
          type={type}
          className={`${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-6 text-sm text-white font-medium rounded-full transition-all active:scale-90 duration-300 bg-[#6750A4] shadow-none hover:shadow-md`}
          onClick={onClick}
        >
          {children}
        </button>
      ) : buttonStyle === "text-button" ? (
        <button
          title={title}
          type={type}
          className={`${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-3 text-sm text-[#6750A4] font-medium rounded-full transition-all active:scale-90 duration-300 bg-transparent hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]`}
          onClick={onClick}
        >
          {children}
        </button>
      ) : buttonStyle === "text-button-with-icon" ? (
        <button
          title={title}
          type={type}
          className={`flex items-center gap-x-2 ${
            width === "full" ? "justify-center w-full" : "w-auto"
          } py-2.5 px-3 text-sm text-[#6750A4] font-medium rounded-full transition-all active:scale-90 duration-300 bg-transparent hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]`}
          onClick={onClick}
        >
          <span className="text-lg">{icon}</span>

          {children}
        </button>
      ) : buttonStyle === "tonal-button" ? (
        <button
          title={title}
          type={type}
          className={`${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-6 text-sm text-[#1D192B] font-medium rounded-full transition-all active:scale-90 duration-300 bg-[#E8DEF8] shadow-none hover:shadow-md`}
          onClick={onClick}
        >
          {children}
        </button>
      ) : buttonStyle === "tonal-button-with-icon" ? (
        <button
          title={title}
          type={type}
          className={`flex items-center gap-x-2 ${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 pl-4 pr-6 text-sm text-[#1D192B] font-medium rounded-full transition-all active:scale-90 duration-300 bg-[#E8DEF8] shadow-none hover:shadow-md`}
          onClick={onClick}
        >
          <span className="text-lg text-[#1D192B]">{icon}</span>
          {children}
        </button>
      ) : buttonStyle === "outlined" ? (
        <button
          title={title}
          type={type}
          className={`border border-[#79747E] ${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-6 text-sm text-[#6750A4] font-medium rounded-full transition-all active:scale-90 duration-300 hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]`}
          onClick={onClick}
        >
          {children}
        </button>
      ) : buttonStyle === "outlined-with-icon" ? (
        <button
          title={title}
          type={type}
          className={`flex justify-center items-center gap-x-2 border border-[#79747E] ${
            width === "full" ? "w-full" : "w-auto"
          } py-2.5 px-4 text-sm text-[#6750A4] font-medium rounded-full transition-all active:scale-90 duration-300 hover:bg-[#6750A4]/[.08] active:bg-[#6750A4]/[.12]`}
          onClick={onClick}
        >
          <span className="text-lg text-[#6750A4]">{icon}</span>
          {children}
        </button>
      ) : null}
    </>
  );
};

export default Button;
