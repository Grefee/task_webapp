import React from "react";
import bcrypt from 'bcryptjs';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { format, secondsToHours } from 'date-fns';
import {
    QueryClient,
    QueryClientProvider,
    useQueryClient,
    useQuery,
    useMutation,
  } from "@tanstack/react-query";


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useSocket } from '../socket/socket.jsx';
import variables from '../../variables.json';
const IP = process.env.REACT_APP_IP_ADD;
const ipPort = process.env.REACT_APP_IP_PORT;
const filterArray = variables.filter





async function getAllUsers(IP){
    const response = await fetch(`http://${IP}:${ipPort}/getAllUsers`, {
        method: 'GET',
        });
        return response.json();
}

function Deactivatebtn({user, refetchUsers}){
    
    const { status, error, mutate } = useMutation({
      mutationFn: (id) => {
        console.log(id)
        return fetch(`http://${IP}:${ipPort}/activateUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          
          body: JSON.stringify({
            "user_id": id
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "User activated successfully",
      });
      refetchUsers();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to deactivate user",
        }),
    });
  
    const deactivateBtn = () => {
      Swal.fire({
        width: 800,
        title: `Do you really want to deactivate user: ${user.user_name}`,
        html: ` 
  
        `,
       
     showCancelButton: true,
     confirmButtonText: "Confirm",
     cancelButtonText: "Cancel",      
     preConfirm: async () => {
  
        await mutate(user.user_id);
  
     },
  
  
  });
  };
    return(
      <button className="button-28 max-w-fit" onClick={() => deactivateBtn(user.user_id)}>Deactivate</button>
  ) 
}
function Resetbtn({user}) {
    const { status, error, mutate } = useMutation({
        mutationFn: ({id, newPass}) => {
        console.log(id)
        console.log(newPass)
          return fetch(`http://${IP}:${ipPort}/changePassword`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "user_id" : id,
              "user_password" : newPass
            }),
          });
        }, 
        onSuccess: () => {  
            Swal.fire({
                icon: 'success',
                title: 'Password Changed',
                text: 'Password has been successfully changed'
            });
        },
        onError: () =>{
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error in changing password'
            });
        }
    });

const resetBtn = (user) => {
    Swal.fire({
        width: 700,
        title: 'Reset Password',
        html:`
        <div style="display: flex; flex-direction: column; align-items: center;">
            <div>
            <label> For User: ${user.user_name}</label>
            </div>
            <div style="display: flex; align-items: center;">
                <label for="newPassword" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Enter new password: </label>
                <input id="newPassword" type="password" value="" class="swal2-input" style="background-color: rgb(226 232 240)">
            </div>
            <div style="display: flex; align-items: center;">
                <label for="confirmPassword" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Enter same password: </label>
                <input id="confirmPassword" type="password" value="" class="swal2-input" style="background-color: rgb(226 232 240)">
            </div>
        </div>

            `,
        showCancelButton: true,
        confirmButtonText: 'Save Password',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: async () => {
            let id = user.user_id
            let newPass = document.getElementById('newPassword').value;
            let confirmPass = document.getElementById('confirmPassword').value;
            if(newPass === "" || confirmPass === ""){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Password cannot be empty'
                }).then(() => {
                    resetBtn(user);
                });
              }
              else if(newPass !== confirmPass){
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Both Password should be same'
                }).then(() => {
                    resetBtn(user);
                });
              }
              else {
            
            await mutate({id, newPass});
            }
        },  
     });
};
  return(
    <button className="button-28 max-w-fit" onClick={() => resetBtn(user)}>Reset pw</button>
) 
}
function Createbtn({refetchUsers}) {
    const { status, error, mutate } = useMutation({
        mutationFn: ({htmlUsername, htmlPassword, htmlAccType}) => {
          return fetch(`http://${IP}:${ipPort}/createUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "username": htmlUsername,
                "password": htmlPassword,
                "userType": htmlAccType,
            }),
          });
        },   
    onSuccess: () => {
        refetchUsers();
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
        document.getElementById("userType").value= "";
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "New user added successfully",
        });
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add new user",
        }),
    });

    const createBtn = () => {
        let htmlUsername = document.getElementById("username").value;
        let htmlPassword = document.getElementById("password").value;
        let htmlAccType = document.getElementById("userType").value;

        if (htmlUsername.trim() !== '' && htmlPassword.trim() !== '' &&  htmlAccType.trim() !== '') {
            console.log('passed');
            mutate({htmlUsername, htmlPassword, htmlAccType});
          } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "All inputs must be filled",
                }) 
        };
    };
    return (
        <button className="button-28 max-w-fit" onClick={createBtn}>create user</button>
      );
    
}




function AdminUsers() {
    const socket = useSocket();
    const {isLoading: usersLoadingStatus, data: users, refetch: refetchUsers} = useQuery({queryKey: ['users'], queryFn: async () => await getAllUsers(IP), initialData: []});

    useEffect(() => {
        if (socket) {
            // refetch from outside update
            socket.on("fetch_users", (arg) => {
                refetchUsers();
                console.log(arg); // world
                });
        }
      }, [socket]);

      if (usersLoadingStatus) {
        return <span>Loading...</span>
        }

    return(
        <div className="bg-white w-full h-full flex flex-col items-center">
        <div className="w-11/12 h-full bg-white mt-20 rounded-3xl flex justify-end">
            <div className="w-6/12 bg-white mt-20 mr-20 p-10 rounded-3xl h-full shadow-2xl border">
                <div>
                    <h1 className="font-serif text-2xl underline underline-offset-4 pb-10">Přidat uživatele</h1>
                </div>
                    <div className="flex flex-row w-full">    
                        <div className="w-1/2">



                        <div className="flex flex-row w-4/6 mx-3 my-3 rounded-2xl">
                            <div className="flex pr-3 align-middle py-2 justify-start">
                                <label>Username:</label>
                            </div>
                            <div className="flex  w-3/4 align-middle justify-start">
                                <input id="username" type="text" className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md"></input>
                            </div>
                        </div>


                        <div className="flex flex-row w-4/6 mx-3 my-3 rounded-2xl">
                            <div className="flex pr-3 align-middle py-2 justify-start">
                                <label>Password:</label>
                            </div>
                            <div className="flex  w-3/4 align-middle justify-start">
                                <input id="password" type="text" className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md"></input>
                            </div>
                        </div>
                            


                        <div className="flex flex-row w-4/6 mx-3 my-3  rounded-2xl">
                            <div className="flex pr-3 align-middle py-2 justify-start min-w-fit">
                                <label>User Type:</label>
                            </div>

                            <div className="flex  w-3/4 align-middle justify-start">
                                <select className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md" name="userType"  id="userType" required>
                                    <option key="" value="" disabled defaultValue hidden></option>
                                    <option key="admin" value="admin" id="admin">admin</option>
                                    <option key="shift leader" value="shift leader" id="shift leader">shift leader</option>
                                </select> 
                            </div>
                        </div>
                    </div>
                
                        <div className="w-1/2 flex items-center justify-center">
                                <Createbtn refetchUsers={refetchUsers} />
                        </div>
                    </div>
            </div>
        </div>

        <div className="bg-white mt-20 pt-20 pl-20 pb-20 pr-20 w-11/12 rounded-3xl">
            <div>

                <div className="pt-5 pb-5">
                    <h1 className="text-2xl font-serif underline underline-offset-4">Seznam uživatelů</h1>
                </div>

                <div className=" relative border w-full rounded-3xl overflow-hidden">
                    <table className="w-full text-black-500 dark:text-gray-400 overflow-hidden">
                        <thead>
                            <tr className="bg-slate-600 text-left text-white">
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">User type</th>
                                <th className="px-6 py-3">Active</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => ( 
                                <tr key={user.user_id} className="bg-white border-b hover:bg-slate-200">
                                    <td className="px-6 py-3">{user.user_name}</td>
                                    <td className="px-6 py-3">{user.user_acctype}</td>
                                    <td className="px-6 py-3">{user.user_active ===1
                                    ? <a>active</a>
                                    : <a>non active</a>
                                    }</td>
                                    <td className="px-6 py-3"><Resetbtn user={user}/></td>
                                    <td className="px-6 py-3"><Deactivatebtn user={user} refetchUsers={refetchUsers}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>

    </div>

        )
    }



    
export default AdminUsers;