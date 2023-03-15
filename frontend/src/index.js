import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  useNavigate,
} from "react-router-dom";

import { QueryClient, QueryClientProvider,
} from "@tanstack/react-query";

import { SocketProvider } from './components/socket/socket.jsx';
import Home from "./components/home/Home.jsx"

import AddNew from "./components/everyone/AddTask.jsx"
import ShiftLeaders from "./components/shiftleaders/ShiftLeaders.jsx"
import  Admin  from "./components/admin/Admin.jsx"

import AdminTasks from "./components/admin/AdminTasks.jsx"
import AdminUsers from "./components/admin/AdminUsers.jsx"
import AdminOptions from './components/admin/AdminOptions';


const queryClient = new QueryClient();



const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/AddNew" element={<AddNew />} />
      <Route path="/shiftleaders" element={<ShiftLeaders />} />
      <Route path="/admin" element={<Admin />}>
        <Route path="/admin/tasks" element={<AdminTasks />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/options" element={<AdminOptions />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
  </QueryClientProvider>
);