import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { baseURL } from "../../../utils/baseURL";
import { successEmitter, errorEmitter } from "../../../utils/emitter";
import { useAllContexts } from "../../Context/AllContexts";
import ButtonLoader from "../../Components/ButtonLoader";
type User = {
  name: string;
  email: string;
  password: string;
};
export default function Register() {
  const [form, setForm] = useState<User>({
    email: "",
    password: "",
    name: "",
  });
  const onChangeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();
  const { loading, setLoading } = useAllContexts();
  const register = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${baseURL}/user/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      let registerData = await response.json();
      if (registerData.success) {
        successEmitter(registerData.message);
        navigate("/login");
      } else errorEmitter(registerData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-2">Task Manager</h1>
        <p className="text-center text-gray-500 mb-6">Create your account</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await register();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>

            <input
              required
              name="name"
              value={form.name}
              onChange={onChangeFunc}
              type="text"
              placeholder="Enter your name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>

            <input
              required
              name="email"
              value={form.email}
              onChange={onChangeFunc}
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>

            <input
              required
              name="password"
              value={form.password}
              onChange={onChangeFunc}
              type="password"
              placeholder="Enter password"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? (
              <div className="flex justify-center gap-2 items-center">
                Registering... <ButtonLoader />
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <NavLink to="/login" className="text-blue-600 font-medium">
            Login
          </NavLink>
        </p>
      </div>
    </div>
  );
}
