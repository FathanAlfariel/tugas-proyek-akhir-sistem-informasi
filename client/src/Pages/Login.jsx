import Button from "../Components/Button";
import Input from "../Components/Input";

const Login = () => {
  return (
    <>
      <div className="max-w-md mx-auto flex flex-col items-center justify-center py-8">
        <h3 className="text-2xl font-semibold">Login</h3>

        <div className="w-full mt-8">
          <div className="flex flex-col gap-y-2">
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
          </div>

          <div className="mt-7">
            <Button type="filled" width="full">
              Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
