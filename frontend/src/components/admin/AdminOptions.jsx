import React from "react";
import bcrypt from 'bcryptjs';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client'
import { format, secondsToHours } from 'date-fns';
import {
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
const filterArray = variables.filter;


function ChangeVariables(){
    const { status, error, mutate } = useMutation({
      mutationFn: (inputs) => {
        return fetch(`http://${IP}:${ipPort}/changeOptions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "filter" : inputs
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task destroyed successfully",
      });
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change filter",
        }),
    });
    const changeVariables = () => {
      Swal.fire({
        width: 800,
        title: `Do you really want to change filter`,
        html: ` 
        `,   
     showCancelButton: true,
     confirmButtonText: "Confirm",
     cancelButtonText: "Cancel",      
     preConfirm: async () => {
        const inputValues = [];
        for (let i = 0; i < filterArray.length; i++) {
          const input = document.getElementById(`${i}`);
          if (input.value !== '') {
            inputValues.push(input.value);
          }
        }
        const newFilterValue = document.getElementById('new').value;
        if (newFilterValue !== ''){
            inputValues.push(newFilterValue);
        } 
        await mutate(inputValues);
      },
    });
  };
    return(
      <button className="button-28 max-w-fit" onClick={changeVariables}>Save</button>
  ) 
  }

  
function AdminOptions() {
    const socket = useSocket();
    useEffect(() => {
        if (socket) {
            // refetch from outside update
            socket.on("fetch_active", (arg) => {
                });
            socket.on("fetch_finished", (arg) => {
              });
        }
      }, [socket]);

      return(
        <div className="bg-white w-full h-full flex flex-col items-center">
            <div className="bg-white mt-5 pt-5 pb-20 pr-5 w-11/12 rounded-3xl">
                <div className="pt-5 pb-5">
                    <h1 className="text-2xl font-serif underline underline-offset-4">Options</h1>
                </div>
                <div className="bg-white mb-5 mt-2 pt-5 pb-5 pl-10 flex justify-start items-center">
                    <div className="flex flex-col my-2 mr-5">
                        {filterArray.map((val, index) => (
                        <input type="text" id={index} className="border-spacing-1 border rounded-2xl p-2 my-2" key={index} defaultValue={val}></input>         
                        ))}
                        <input type="text" id='new' className="border-spacing-1 border rounded-2xl p-2 my-2" key='' defaultValue=''></input>
                    </div>
                </div>
                <div className="">
                    <div className="">
                        <ChangeVariables />
                    </div>
                </div> 
            </div>   
        </div>
        )
    }

    
    export default AdminOptions;
