import { useContext, useState } from "react";
import Button from "../Components/Button";
import Input from "../Components/Input";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Config/UserConfig";
import Loader from "../Components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("Tolong masukkan username."),
      password: yup.string().required("Tolong masukkan password."),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);

      try {
        await axios
          .post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
            username: values.username,
            password: values.password,
          })
          .then(({ data }) => {
            setUser(data);

            navigate("/admin");
          });
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      {isLoading && <Loader />}

      <div className="max-w-md mx-auto flex flex-col items-center justify-center py-8">
        <h3 className="text-2xl font-semibold">Login</h3>

        <div className="w-full mt-8">
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-y-2">
              <Input
                id="username"
                name="username"
                label="Username"
                type="text"
                placeholder="Masukkan username"
                onChange={formik.handleChange("username")}
                onBlur={formik.handleBlur("username")}
                value={formik.values.username}
                errorMessage={formik.touched.username && formik.errors.username}
              />
              <Input
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Masukkan password"
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur("password")}
                value={formik.values.password}
                errorMessage={formik.touched.password && formik.errors.password}
              />
            </div>

            <div className="mt-7">
              <Button type="submit" buttonStyle="filled" width="full">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
