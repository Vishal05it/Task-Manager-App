import { Pencil, Trash2, CheckCircle, Circle, Eye } from "lucide-react";
import { timeCalc } from "../../utils/timeCalc";
import { useState, type SetStateAction } from "react";
import { baseURL } from "../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../utils/emitter";
import ButtonLoader from "./ButtonLoader";
import { useNavigate } from "react-router-dom";
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
type Props = {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdBy: User;
  addedMs: number;
  setOpenEditModal: React.Dispatch<SetStateAction<boolean>>;
  setSelectTask: React.Dispatch<SetStateAction<Task | undefined>>;
  allTasks: Task[];
  setAllTasks: React.Dispatch<SetStateAction<Task[]>>;
};
export default function TaskCard({
  _id,
  title,
  description,
  status,
  addedMs,
  setOpenEditModal,
  setSelectTask,
  setAllTasks,
  allTasks,
}: Props) {
  const [markBtn, setMarkBtn] = useState<boolean>(false);
  const navigate = useNavigate();
  const deleteTask = async () => {
    try {
      let response = await fetch(`${baseURL}/task/api/deletetask/${_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      let deleteData = await response.json();
      if (deleteData.success) {
        successEmitter(deleteData.message);
        setAllTasks(allTasks.filter((task) => task._id != _id));
      } else errorEmitter(deleteData.message);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleStatus = async () => {
    try {
      setMarkBtn(true);
      let response = await fetch(`${baseURL}/task/api/updatetask/${_id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: status == "complete" ? "incomplete" : "complete",
        }),
      });
      let toggleData = await response.json();

      if (toggleData.success) {
        successEmitter(toggleData.message);
        setAllTasks(
          allTasks.map((task) => {
            if (task._id == _id) task.status = toggleData.task.status;
            return task;
          }),
        );
      } else errorEmitter(toggleData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setMarkBtn(false);
    }
  };
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500 mb-1">Status</p>

          <span
            className={`inline-block px-3 py-1 text-sm rounded-full ${
              status == "complete"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {status == "complete" ? "Completed" : "Pending"}
          </span>
        </div>
        <button
          onClick={async () => {
            await toggleStatus();
          }}
          disabled={markBtn}
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm ${
            status == "complete"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status == "complete" ? (
            <>
              {markBtn ? (
                <div className="flex gap-2 items-center justify-center">
                  <Circle size={18} />
                  Marking as Incomplete... <ButtonLoader />
                </div>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <Circle size={18} />
                  Mark as Incomplete
                </div>
              )}
            </>
          ) : (
            <>
              {markBtn ? (
                <div className="flex gap-2 items-center justify-center">
                  <CheckCircle size={18} />
                  Marking as Complete... <ButtonLoader />
                </div>
              ) : (
                <div className="flex gap-2 items-center justify-center">
                  <CheckCircle size={18} />
                  Mark as Complete
                </div>
              )}
            </>
          )}
        </button>
      </div>
      <h2 className="text-xl font-semibold mt-4">
        {title ? title : "Loading Title..."}
      </h2>
      <p className="text-gray-600 mt-2 wrap-break-word">
        {description ? description : "Loading Description..."}
      </p>
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-gray-500">Updated {timeCalc(addedMs)}</p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigate(`/taskdetails/${_id}`);
            }}
            className="p-2 rounded-md border hover:bg-green-500 hover:text-white"
            title="View Task"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => {
              setOpenEditModal(true);
              setSelectTask(
                allTasks.find((task) => {
                  return task._id == _id;
                }),
              );
            }}
            className="p-2 rounded-md border hover:bg-indigo-600 hover:text-white"
            title="Edit Task"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={async () => {
              await deleteTask();
            }}
            className="p-2 rounded-md border hover:bg-red-600 hover:text-white"
            title="Delete Task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
