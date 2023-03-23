
import React from "react";
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { format, secondsToHours } from 'date-fns'
import { useNavigate } from 'react-router-dom';
import {
    useQuery,
    useMutation,
  } from "@tanstack/react-query";
  import { Outlet } from "react-router-dom";
  import Swal from 'sweetalert2'
  import { useSearchParams,
    Link } from "react-router-dom";


function Logout() {
    const navigate = useNavigate();
    const logout = () => {
        sessionStorage.setItem('acc_type', '');
        sessionStorage.setItem('user_name', '');
        navigate('/');    
        }
    return (
        <button className="button-28 max-w-fit" onClick={() => logout()}>Logout</button>
    )
}


function Admin() {
    const navigate = useNavigate();
    useEffect(() => {
        const adminCheck = sessionStorage.getItem('acc_type');
        if (adminCheck !== 'admin') {
          navigate('/');
        }
      }, []);

return(
    <div>
        {/* head */}
        <div className="flex flex-row justify-evenly h-auto p-8 my-0 w-full mt-0 bg-gradient-to-r from-gray-700 to-gray-500 ">
            <div></div>
            <div>
                <h1 className="text-3xl text-white mx-auto">SCM requests - SCM požadavky</h1>   
            </div>
            <div className="">
                <Logout />
            </div>
        </div>
        {/* nav */}
        <div className="flex flex-row">
            <div className="px-3 py-4 rounded bg-slate-200 dark:bg-gray-800 w-48 pt-4 pb-10 ">
                <ul className="space-y-2">
                    <li>
                        <Link to={'/admin/tasks'} className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <svg aria-hidden="true" className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path><path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path></svg>
                            <span className="ml-3">Tasks</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/admin/users'} className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            <span className="ml-3">Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={'/admin/options'} className="flex items-center p-2 mt-5 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"  >
                            <svg aria-hidden="true" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                            <span className="ml-3">Options</span>
                        </Link> 
                    </li>
                </ul>
            </div>
        {/* main */} 
        <Outlet />
        </div>     
    </div>
    )
}


export default Admin;
