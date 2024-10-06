const Button = ({ className, children }) => {
  return (
    <>
      <button
        className={`transition-all active:scale-90 duration-300 ${className}`}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
