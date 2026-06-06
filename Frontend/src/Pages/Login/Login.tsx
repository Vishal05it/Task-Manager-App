import { NavLink, useNavigate } from "react-router-dom";
import { useAllContexts } from "../../Context/AllContexts";
import { useEffect, useState } from "react";
import ButtonLoader from "../../Components/ButtonLoader";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import { verifyLogin } from "../../../utils/verifyLogin";
type Form = {
  email: string;
  password: string;
};
export default function Login() {
  const { loading, setLoading, setUser, isTaskLogin, setIsTaskLogin } =
    useAllContexts();
  const [form, setForm] = useState<Form>({
    email: "",
    password: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const loginForm = async () => {
    try {
      if (isTaskLogin) {
        errorEmitter("Log out first for logging in another account");
        return;
      }
      setLoading(true);

      let response = await fetch(`${baseURL}/user/api/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      let loginData = await response.json();
      // console.log(loginData);
      if (loginData.success) {
        // successEmitter(loginData.message);
        setUser(loginData.user);
        setIsTaskLogin(true);
        localStorage.setItem("taskUser", JSON.stringify(loginData.user));
        localStorage.setItem("isTaskLogin", JSON.stringify(true));
        navigate("/");
      } else errorEmitter(loginData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLogin = async () => {
      if (isTaskLogin) {
        let result = await verifyLogin();
        if (!result) {
          errorEmitter("You are not logged in verification");
          setUser({
            _id: "",
            name: "",
            email: "",
          });
          setIsTaskLogin(false);
          navigate("/login");
          localStorage.removeItem("taskUser");
          localStorage.removeItem("isTaskLogin");
        } else successEmitter("Login verified");
      }
    };
    fetchLogin();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-2">Task Manager</h1>

        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await loginForm();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChangeFunc}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChangeFunc}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? (
              <div className="flex gap-2 items-center justify-center">
                Logging in... <ButtonLoader />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <NavLink to="/register" className="text-blue-600 font-medium">
            Register
          </NavLink>
        </p>
      </div>
    </div>
  );
}
