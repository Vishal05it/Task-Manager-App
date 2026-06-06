type User = {
  _id: string;
  name: string;
  email: string;
};
type Task = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: User;
  addedMs: number;
};
import { Plus, Search } from "lucide-react";
import { useAllContexts } from "../../Context/AllContexts";
import { useEffect, useMemo, useState } from "react";
import NotLogin from "../NotLogin/NotLogin";
import CreateTaskModal from "../../Components/CreateTask";
import TaskCard from "../../Components/TaskCard";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import EditTaskModal from "../../Components/EditTask";
import { verifyLogin } from "../../../utils/verifyLogin";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Loader";

export default function Dashboard() {
  const {
    isTaskLogin,
    allTasks,
    setAllTasks,
    setUser,
    setIsTaskLogin,
    setTask,
    pageLoading,
    setPageLoading,
    lastPage,
    setLastPage,
  } = useAllContexts();
  const [tempTasksLength, setTempTasksLength] = useState<number>(
    allTasks.length,
  );
  const [selectTask, setSelectTask] = useState<Task | undefined>({
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
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [showTasks, setShowTasks] = useState<Task[]>(allTasks);
  const [page, setPage] = useState<number>(1);
  const getAllTasks = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/task/api/getalltasks?page=${page}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      let tasksData = await response.json();
      // console.log(tasksData);
      if (tasksData.success) {
        successEmitter(tasksData.message);
        setAllTasks(tasksData.allTasks);
        setLastPage(tasksData.lastPage);
      } else errorEmitter(tasksData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  const pendingTasks = useMemo(() => {
    let pendingCount = 0;
    allTasks.map((task) => {
      if (task.status == "incomplete") {
        pendingCount++;
      }
    });
    return pendingCount;
  }, [allTasks]);
  const allPendingTasks = useMemo(() => {
    let pendingArray = allTasks.filter((task) => {
      if (task.status == "incomplete") {
        return task;
      }
    });
    return pendingArray;
  }, [allTasks]);
  const [keyword, setKeyWord] = useState<string>("");
  let filteredArr = useMemo(() => {
    if (keyword == "") {
      setShowTasks(allTasks);
      return allTasks;
    }
    return allTasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(keyword.toLowerCase()) ||
        task.description.toLowerCase().includes(keyword.toLowerCase())
      );
    });
  }, [keyword]);
  const completeTasks = useMemo(() => {
    let completeCount = 0;
    allTasks.map((task) => {
      if (task.status == "complete") {
        completeCount++;
      }
    });
    return completeCount;
  }, [allTasks]);
  const allCompleteTasks = useMemo(() => {
    let completeArray = allTasks.filter((task) => {
      if (task.status == "complete") {
        return task;
      }
    });
    return completeArray;
  }, [allTasks]);
  useEffect(() => {
    const fetchTasks = async () => {
      await getAllTasks();
    };
    fetchTasks();
  }, [page]);
  const navigate = useNavigate();
  const logOutFunc = async () => {
    try {
      let response = await fetch(`${baseURL}/user/api/logout`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let logOutData = await response.json();
      console.log(logOutData);
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
    }
  };
  useEffect(() => {
    const fetchLogin = async () => {
      if (isTaskLogin) {
        let result = await verifyLogin();
        if (!result) {
          errorEmitter("You are not logged in verification");
          logOutFunc();
          navigate("/login");
        } // else successEmitter("Login verified");
      }
    };
    fetchLogin();
  }, []);
  useEffect(() => {
    setShowTasks(allTasks);
  }, [allTasks]);
  useEffect(() => {
    setShowTasks(filteredArr);
  }, [keyword]);
  useEffect(() => {
    if (allTasks.length > tempTasksLength + 5) {
      const fetchAllTasks = async () => {
        await getAllTasks();
      };
      fetchAllTasks();
      setTempTasksLength(allTasks.length);
    }
  }, [allTasks]);
  return (
    <>
      {!isTaskLogin ? (
        <NotLogin />
      ) : (
        <>
          {pageLoading ? (
            <Loader />
          ) : (
            <div className="min-h-screen bg-gray-100">
              {openAddModal && (
                <CreateTaskModal
                  allTasks={allTasks}
                  setAllTasks={setAllTasks}
                  setOpenAddModal={setOpenAddModal}
                />
              )}
              {openEditModal && (
                <EditTaskModal
                  allTasks={allTasks}
                  setAllTasks={setAllTasks}
                  id={selectTask?._id as string}
                  title={selectTask?.title || ""}
                  description={selectTask?.description || ""}
                  setOpenEditModal={setOpenEditModal}
                />
              )}
              <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h1 className="text-3xl font-bold">Dashboard</h1>

                  <button
                    onClick={() => {
                      setOpenAddModal(true);
                    }}
                    className="px-4 flex gap-2 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    <Plus /> Create Task
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <p className="text-gray-500 text-sm">Total Tasks</p>

                    <h2 className="text-3xl font-bold mt-2">
                      {allTasks.length}
                    </h2>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <p className="text-gray-500 text-sm">Completed Tasks</p>

                    <h2 className="text-3xl font-bold mt-2 text-green-600">
                      {completeTasks}
                    </h2>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-sm border">
                    <p className="text-gray-500 text-sm">Pending Tasks</p>

                    <h2 className="text-3xl font-bold mt-2 text-yellow-600">
                      {pendingTasks}
                    </h2>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search
                        size={18}
                        className="absolute left-3 top-3 text-gray-400"
                      />

                      <input
                        type="text"
                        value={keyword}
                        onChange={(e) => {
                          setKeyWord(e.target.value);
                          console.log("Filtered Arr = ", filteredArr);
                          console.log(`Keyword = ${keyword}`);
                        }}
                        placeholder="Search tasks..."
                        className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value == "completed") {
                          setShowTasks(allCompleteTasks as Task[]);
                        } else if (e.target.value == "alltasks") {
                          setShowTasks(allTasks);
                        } else {
                          setShowTasks(allPendingTasks as Task[]);
                        }
                      }}
                      className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
                    >
                      <option value="alltasks">All Tasks</option>

                      <option value="completed">Completed</option>

                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4 5">
                  <div className="bg-white flex flex-col gap-5 p-6 rounded-lg border shadow-sm">
                    {showTasks.length > 0 ? (
                      showTasks.map((task, idx) => {
                        return (
                          <TaskCard
                            setAllTasks={setAllTasks}
                            setSelectTask={setSelectTask}
                            allTasks={allTasks}
                            key={idx}
                            title={task.title}
                            _id={task._id}
                            description={task.description}
                            status={task.status}
                            createdBy={task.createdBy}
                            addedMs={task.addedMs}
                            setOpenEditModal={setOpenEditModal}
                          />
                        );
                      })
                    ) : (
                      <div className="w-full flex justify-center items-center">
                        No Tasks posted yet
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(page - 1);
                    }}
                    className={
                      page <= 1
                        ? `px-4 py-2 border bg-gray-200 text-gray-500 border-gray-900 rounded-md hover:bg-gray-300`
                        : `px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100`
                    }
                  >
                    Previous
                  </button>

                  <button
                    disabled={page >= lastPage}
                    onClick={() => {
                      setPage(page + 1);
                    }}
                    className={
                      page >= lastPage
                        ? `px-4 py-2 bg-blue-700 text-gray-400 rounded-md hover:bg-blue-800`
                        : `px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700`
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
