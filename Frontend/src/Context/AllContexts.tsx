import { createContext, useContext, useState, type ReactNode } from "react";
type Context = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  task: Task;
  setTask: React.Dispatch<React.SetStateAction<Task>>;
  allTasks: Task[];
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isTaskLogin: boolean;
  setIsTaskLogin: React.Dispatch<React.SetStateAction<boolean>>;
  pageLoading: boolean;
  setPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
  lastPage: number;
  setLastPage: React.Dispatch<React.SetStateAction<number>>;
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
import React from "react";
const allContext = createContext<Context | null>(null);

function AllContexts({ children }: { children: ReactNode }) {
  const storedUser = localStorage.getItem("taskUser");
  const [user, setUser] = useState<User>(
    storedUser
      ? JSON.parse(storedUser)
      : {
          _id: "",
          name: "",
          email: "",
        },
  );
  const [task, setTask] = useState<Task>({
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
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastPage, setLastPage] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const storedLogin = localStorage.getItem("isTaskLogin");
  const [isTaskLogin, setIsTaskLogin] = useState<boolean>(
    storedLogin ? JSON.parse(storedLogin) : false,
  );
  return (
    <allContext.Provider
      value={{
        user,
        setUser,
        task,
        setTask,
        allTasks,
        setAllTasks,
        loading,
        setLoading,
        isTaskLogin,
        setIsTaskLogin,
        pageLoading,
        setPageLoading,
        lastPage,
        setLastPage,
      }}
    >
      {children}
    </allContext.Provider>
  );
}
export const useAllContexts = () => {
  let context = useContext(allContext);
  if (!context) {
    throw new Error("Wrap the context with the React Node");
  }
  return context;
};
export default AllContexts;
