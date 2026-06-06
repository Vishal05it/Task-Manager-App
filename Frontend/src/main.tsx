import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard.tsx";
import Register from "./Pages/Register/Register.tsx";
import Login from "./Pages/Login/Login.tsx";
import TaskDetails from "./Pages/CardDetails/TaskDetails.tsx";
import AllContexts from "./Context/AllContexts.tsx";
let myRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="" element={<Dashboard />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/taskdetails/:taskId" element={<TaskDetails />} />
    </Route>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AllContexts>
      <RouterProvider router={myRouter} />
    </AllContexts>
  </StrictMode>,
);
