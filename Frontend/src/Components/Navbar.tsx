import { NavLink, useNavigate } from "react-router-dom";
import { useAllContexts } from "../Context/AllContexts";
import { baseURL } from "../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../utils/emitter";
import { DoorOpen } from "lucide-react";
import { verifyLogin } from "../../utils/verifyLogin";
import { useEffect, useState } from "react";
import ButtonLoader from "./ButtonLoader";

export default function Navbar() {
  const [logBtn, setLogBtn] = useState<boolean>(false);
  const { isTaskLogin, setIsTaskLogin, user, setUser, setAllTasks, setTask } =
    useAllContexts();
  const navigate = useNavigate();
  const logOutFunc = async () => {
    try {
      setLogBtn(true);
      let response = await fetch(`${baseURL}/user/api/logout`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logOutData = await response.json();
      // console.log(logOutData);
      if (logOutData.success) {
        successEmitter(logOutData.message);
        setUser({
          _id: "",
          name: "",
          email: "",
        });
        setIsTaskLogin(false);
        setTask({
          _id: "",
          title: "",
          description: "",
          status: "",
          addedMs: 0,
          createdBy: {
            _id: "",
            name: "",
            email: "",
          },
        });
        setAllTasks([]);
        localStorage.removeItem("taskUser");
        localStorage.removeItem("isTaskLogin");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLogBtn(false);
    }
  };
  useEffect(() => {
    const fetchLogin = async () => {
      if (isTaskLogin) {
        let result = await verifyLogin();
        if (!result) {
          errorEmitter("You are not logged in verification");
          logOutFunc();
          setUser({
            _id: "",
            name: "",
            email: "",
          });
          setIsTaskLogin(false);
          setTask({
            _id: "",
            title: "",
            description: "",
            status: "",
            addedMs: 0,
            createdBy: {
              _id: "",
              name: "",
              email: "",
            },
          });
          setAllTasks([]);
          localStorage.removeItem("taskUser");
          localStorage.removeItem("isTaskLogin");
          navigate("/login");
        } //else successEmitter("Login verified");
      }
    };
    fetchLogin();
  }, []);
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
          {isTaskLogin ? (
            <NavLink to="/" className="text-2xl font-bold text-gray-800">
              Welcome <span className="text-indigo-600">{user.name}</span>
            </NavLink>
          ) : (
            <NavLink to="/" className="text-2xl font-bold text-gray-800">
              Task Manager
            </NavLink>
          )}
          <div className="flex items-center gap-3">
            {!isTaskLogin ? (
              <NavLink
                to="/login"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </NavLink>
            ) : (
              <button
                disabled={logBtn}
                onClick={async () => {
                  await logOutFunc();
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-100 hover:bg-red-700 bg-red-600 transition"
              >
                {logBtn ? (
                  <div className="flex justify-center items-center gap-2">
                    <DoorOpen /> Logging Out... <ButtonLoader />
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <DoorOpen /> Log Out
                  </div>
                )}
              </button>
            )}

            {!isTaskLogin && (
              <NavLink
                to="/register"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Register
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
