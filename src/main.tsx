import "@arco-design/web-react/es/_util/react-19-adapter";

import React from "react";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import Simple from "./examples/Simple";
import "./global.css";

const router = createBrowserRouter([
  {
    path: "/simple",
    element: <Simple />,
  },
  {
    path: "*",
    element: <Navigate to="/simple" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
