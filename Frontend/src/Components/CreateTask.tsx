import { useState } from "react";
import { baseURL } from "../../utils/baseURL";
import { successEmitter } from "../../utils/emitter";
import { useAllContexts } from "../Context/AllContexts";
import ButtonLoader from "./ButtonLoader";

type Props = {
  allTasks: Task[];
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setOpenAddModal: React.Dispatch<React.SetStateAction<boolean>>;
};
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
type formTask = {
  title: string;
  description: string;
};

export default function CreateTaskModal({
  allTasks,
  setAllTasks,
  setOpenAddModal,
}: Props) {
  const [task, setTask] = useState<formTask>({
    title: "",
    description: "",
  });
  const onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  const { loading, setLoading } = useAllContexts();
  const addTask = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${baseURL}/task/api/createtask`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      let taskData = await response.json();
      // console.log(taskData);
      if (taskData.success) {
        successEmitter(taskData.message);
        setAllTasks([...allTasks, taskData.task]);
        setOpenAddModal(false);
        setTask({
          title: "",
          description: "",
        });
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-5">Add New Task</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await addTask();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Title</label>

            <input
              required
              type="text"
              name="title"
              value={task.title}
              onChange={onChangeFunc}
              placeholder="Enter task title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              required
              name="description"
              value={task.description}
              onChange={onChangeFunc}
              rows={4}
              placeholder="Enter task description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setOpenAddModal(false);
              }}
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {loading ? (
                <div className="flex gap-2 items-center justify-center">
                  {" "}
                  Adding Task... <ButtonLoader />
                </div>
              ) : (
                "Add Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
