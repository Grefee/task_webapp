import React from "react";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs'
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import io from 'socket.io-client';
import Swal from 'sweetalert2'
import variables from '../../variables.json';

const IP = process.env.REACT_APP_IP_ADD;
const ipPort = process.env.REACT_APP_IP_PORT;
const filterArray = variables.filter



function LogIn() {
  document.addEventListener('keydown', function enterPressed(e){
    if(e.key === 'Enter'){
         e.preventDefault();
        console.log(e.key);
        logInClick(); 
    } 
})
  const navigate = useNavigate();
  const { status, error, mutate } = useMutation({
    mutationFn: ({htmlUser, htmlPwd}) => {
      return fetch(`http://${IP}:${ipPort}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": htmlUser,
            "password": htmlPwd,
        }),
      }).then(response => response.json());
    },
    onSuccess: (data) =>{
      if (data.message === 'User not found' || data.message === 'Wrong password' || data.message === 'User not active'){
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
        document.getElementById("password").value= "";
      }
      console.log(data.message)
      sessionStorage.setItem('user_name', data.user_name); 
      sessionStorage.setItem('acc_type', data.acc_type);
      //data.acc_type === admin
      if (data.acc_type === 'admin') {
        navigate('/admin');
      } else if (data.acc_type === 'shift leader') {
        navigate('/shiftleaders');
      } else {
        navigate('/');
      }
    },

    onError: (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to login in, try again",
        });
    }
  });

  const logInClick = () => {
    let htmlUser = document.getElementById("login").value;
    let htmlPwd = document.getElementById("password").value;
    if (htmlUser.trim() !== '' && htmlPwd.trim() !== ''){
      mutate({htmlUser, htmlPwd})
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Some of the inputs can't be empty",
      }) 
    };
  }

  return (            
    <button className="bg-red-500 mb-2 mt-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      onClick={logInClick}
    >
      Log In
    </button>
  )
}

function Home() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const toNewTaskClick = () => {
    //socket.emit('test', 'hello from the front-end');
    navigate(`/AddNew`)
  }

  return (  
    <div className="flex flex-col justify-start w-90 h-screen items-center">
      <div className='text-center p-8 my-0 w-full mt-0 bg-gradient-to-r from-gray-700 to-gray-500 '>
        <h1 className="text-3xl text-white">SCM requests - SCM požadavky</h1>
      </div>
        <div className="flex h-auto my-80 w-96 items-center justify-center bg-gradient-to-br from-gray-600 to-blue-500 rounded-3xl shadow-2xl">
          <div className="flex flex-col  mx-9 my-3 rounded-2xl">
            <div className="flex flex-row mb-2 mt-5 justify-end">
                  <div className="flex align-middle py-2 pr-2 justify-center text-white">
                      <label>Login: </label> 
                  </div>
                  <div className="flex">
                    <input type="text" id="login" name="login" required  className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md" /> 
                  </div>
            </div>
            <div className="flex flex-row mb-2 mt-5 ">
                  <div className="flex align-middle py-2 pr-2 justify-center text-white">
                      <label>Password: </label> 
                  </div>
                  <div>
                      <input type="password" id="password" name="password" required className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md" />
                  </div>
            </div>
            <LogIn />
            <span className="bg-black h-1 my-2"></span>
            <button className="bg-red-500 my-2 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-8 rounded-full"
            onClick={(event) => toNewTaskClick(event)}
            >
              Create new Task
            </button>
          </div>
          <div>
          </div>
        </div>
    </div>
  );
}

export default Home;
