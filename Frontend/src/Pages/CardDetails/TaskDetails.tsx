import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import { timeCalc } from "../../../utils/timeCalc";
import { useAllContexts } from "../../Context/AllContexts";
import Loader from "../../Components/Loader";
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
export default function ViewTask() {
  const { pageLoading, setPageLoading } = useAllContexts();
  const param = useParams();
  const [task, setTask] = useState<Task>({
    _id: "",
    title: "",
    description: "",
    createdBy: {
      _id: "",
      name: "",
      email: "",
    },
    status: "",
    addedMs: 0,
  });
  const getTask = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/task/api/getonetask/${param.taskId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      let taskData = await response.json();
      // console.log(taskData);
      if (taskData.success) {
        successEmitter(taskData.message);
        setTask(taskData.task);
      } else errorEmitter(taskData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  useEffect(() => {
    const fetchTask = async () => {
      await getTask();
    };
    fetchTask();
  }, []);
  return (
    <>
      {" "}
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-100 px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Status</p>

                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                  {task.status
                    ? task.status == "complete"
                      ? "Complete"
                      : "Pending"
                    : "Loading status..."}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {task.title ? task.title : "Loading title..."}
              </h1>
              <p className="text-gray-700 leading-relaxed">
                {task.description ? task.description : "Loading description"}
              </p>
              <div className="border-t mt-6 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <p className="text-sm text-gray-500">
                  Updated{" "}
                  {task.addedMs ? timeCalc(task.addedMs) : "Loading time..."}
                </p>
                <p className="text-sm text-gray-500 italic">
                  Created by{" "}
                  {task.createdBy.name
                    ? task.createdBy.name
                    : "Loading Author..."}
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-100 transition"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
