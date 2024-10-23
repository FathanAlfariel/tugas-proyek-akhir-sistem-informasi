import Button from "../Components/Button";
import Input from "../Components/Input";

const Login = () => {
  return (
    <>
      <div className="border max-w-md mx-auto flex flex-col items-center justify-center">
        <h3 className="text-2xl font-semibold">Login</h3>

        <div className="w-full">
          <Input
            id="username"
            label="Username"
            type="text"
            placeholder="Masukkan username"
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="Masukkan password"
          />

          <Button className="w-full px-3 py-2.5 text-sm font-medium rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100">
            Login
          </Button>
        </div>
      </div>
    </>
  );
};

export default Login;
