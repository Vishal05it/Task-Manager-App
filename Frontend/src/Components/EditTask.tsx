import { useState, type SetStateAction } from "react";
import { baseURL } from "../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../utils/emitter";
import { useAllContexts } from "../Context/AllContexts";
import ButtonLoader from "./ButtonLoader";
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
  title: string;
  description: string;
  id: string;
  allTasks: Task[];
  setAllTasks: React.Dispatch<SetStateAction<Task[]>>;
  setOpenEditModal: React.Dispatch<SetStateAction<boolean>>;
};
type TempTask = {
  title: string;
  description: string;
};

export default function EditTaskModal({
  id,
  title,
  description,
  setOpenEditModal,
  allTasks,
  setAllTasks,
}: Props) {
  const { loading, setLoading } = useAllContexts();
  const [tempTask, setTempTask] = useState<TempTask>({
    title: title,
    description: description,
  });
  const onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setTempTask({ ...tempTask, [e.target.name]: e.target.value });
  };
  const updateTask = async () => {
    try {
      setLoading(true);
      let response = await fetch(`${baseURL}/task/api/updateTask/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempTask),
      });
      let editData = await response.json();
      // console.log(editData);
      if (editData.success) {
        successEmitter(editData.message);
        setAllTasks(
          allTasks.map((task) => {
            if (task._id == id) {
              task.title = editData.task.title;
              task.description = editData.task.description;
            }
            return task;
          }),
        );
        setOpenEditModal(false);
        return true;
      } else {
        errorEmitter(editData.message);
        return false;
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
        <h2 className="text-xl font-semibold mb-5">Edit Task</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await updateTask();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Change Title</label>

            <input
              type="text"
              value={tempTask.title}
              name="title"
              onChange={onChangeFunc}
              placeholder="Enter new title"
              className="w-full border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Change Description</label>

            <textarea
              name="description"
              value={tempTask.description}
              onChange={onChangeFunc}
              rows={4}
              placeholder="Enter new description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 resize-none outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => {
                setOpenEditModal(false);
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
                  Submitting...
                  <ButtonLoader />
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
