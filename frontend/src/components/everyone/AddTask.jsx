
import React from "react";
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
  import variables from '../../variables.json';

  import { useSocket } from '../socket/socket.jsx';
  import { useNavigate } from 'react-router-dom';

  const IP = process.env.REACT_APP_IP_ADD;
  const ipPort = process.env.REACT_APP_IP_PORT;
  const filter = variables.filter;

async function fetchActiveTasks(IP) {
    const response = await fetch(`http://${IP}:${ipPort}/getActiveTasks`, {
        method: 'GET',
        });
        return response.json();
}

function InsertNewTask({refetchTasks}){
    const { status, error, mutate } = useMutation({
        mutationFn: ({htmlRequest, htmlTaskTo, htmlDescription, formattedUtcPlusOneDate, htmlEmail, htmlFileLink}) => {
          return fetch(`http://${IP}:${ipPort}/createNewTask`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requester: htmlRequest,
                taskTo: htmlTaskTo,
                description: htmlDescription,
                finalDateTime: formattedUtcPlusOneDate,
                email: htmlEmail,
                fileLink: htmlFileLink
            }),
          });
        },   
    onSuccess: () => {
        document.getElementById("requester").value = "";
        document.getElementById("taskto").value = "";
        document.getElementById("description").value = "";
        document.getElementById("time").value = "";
        document.getElementById("date").value = "";
        document.getElementById("filelink").value = "";
        document.getElementById("email").value = "";
        Swal.fire({
        icon: "success",
        title: "Success",
        text: "New process added successfully",
        });
    refetchTasks();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to add new process",
        }),
    });

    const addNewTask = () => { 
        let htmlRequest = document.getElementById("requester").value;
        let htmlTaskTo = document.getElementById("taskto").value;
        let htmlDescription = document.getElementById("description").value;
        let htmlTime = document.getElementById("time").value;
        let htmlDate = document.getElementById("date").value;
        let htmlFileLink = document.getElementById("filelink").value;
        let htmlEmail = document.getElementById("email").value;
        
        if (htmlRequest.trim() !== '' && htmlTaskTo.trim() !== '' &&  htmlTime.trim() !== '' &&  htmlDate.trim() !== '' &&  htmlDescription.trim() !== '' && htmlEmail.trim() !== '') {
            let htmlFinalDateTime = new Date(htmlDate + ' ' + htmlTime);
            let utcPlusOneDate = new Date(htmlFinalDateTime.valueOf() + 60 * 60 * 1000);
            let formattedUtcPlusOneDate = utcPlusOneDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '');
            mutate({htmlRequest, htmlTaskTo, htmlDescription, formattedUtcPlusOneDate, htmlFileLink, htmlEmail});
          } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Some of the inputs can't be empty",
                }) 
        };
    };
    
    return (
        <button className="button-28" onClick={addNewTask}>create task</button>
      );
}

async function fetchActiveHistory(IP) {
    const response = await fetch(`http://${IP}:${ipPort}/getActiveHistory`, {
        method: 'GET',
        });
        return response.json();
  }

function Back() {
    const navigate = useNavigate();
    const back = () => {
        sessionStorage.setItem('acc_type', '');
        sessionStorage.setItem('user_name', '');
        navigate('/');
}
return (
    <button className="button-28 max-w-fit" onClick={() => back()}>Back</button>
    )
}


function AddNew() { 
    const {isLoading: taskHistoryLoadingStatus, data: tasksHistory, refetch: refetchTasksHistory} = useQuery({queryKey: ['tasksHistory'], queryFn: async () => await fetchActiveHistory(IP), initialData: []});
    const {isLoading: taskLoadingStatus, data: tasks, refetch: refetchTasks} = useQuery({queryKey: ['tasks'], queryFn: async () => await fetchActiveTasks(IP), initialData: []});
    const socket = useSocket();
    const [expandedTasks, setExpandedTasks] = useState([]);
    useEffect(() => {
        if (socket) {
            // refetch from outside update
            socket.on("fetch_active", (arg) => {
                refetchTasks();
                refetchTasksHistory();
                console.log(arg); // world
                });
        }
      }, [socket]);

function showHistory(task_id) {
    if (expandedTasks.includes(task_id)) {
      setExpandedTasks(expandedTasks.filter(taskId => taskId !== task_id));
    } else {
      setExpandedTasks([...expandedTasks, task_id]);
    }
  };
if (taskLoadingStatus || taskHistoryLoadingStatus) {
    return <span>Loading...</span>
    }
return (
    <div className="flex flex-col justify-start h-fit items-center">
        <div className="flex flex-row justify-evenly h-auto p-8 my-0 w-full mt-0 bg-gradient-to-r from-gray-700 to-gray-500 ">
            <div></div>
            <div>
                <h1 className="text-3xl text-white mx-auto">SCM requests - SCM požadavky</h1>   
            </div>
            <div className="">
                <Back />
            </div>
          </div>
       {/* new task div */}
       <div className=" flex flex-col w-6/12 bg-white border-2  shadow-inner border-gray-200 h-fir items-center mt-10 pt-10 pb-10 mb-20 rounded-3xl">
            <div className="flex flex-row w-4/6 mx-9 my-3 rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>Requester:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                    <input id="requester" type="text" className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md"></input>
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>Task To:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                  <select className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md" name="taskto"  id="taskto" required>
                    <option key="" value="" disabled defaultValue hidden></option>
                        {filter.map((val, index) => (
                            <option key={index} value={val}>{val}</option>
                        ))}
                    </select> 
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>Description:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                    <textarea id="description" className="p-2 h-24 w-11/12 resize-none overflow-auto break-words bg-white border-2  shadow-inner border-gray-200 rounded-md"></textarea>
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>Final Date and Time:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                    <input id="date" type="date" className="bg-white border-2 p-2  shadow-inner border-gray-200 rounded-md" />
                    <input id="time" type="time" className="bg-white border-2 p-2 ml-5 shadow-inner border-gray-200 rounded-md" />
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>File Link:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                    <textarea id="filelink" className="p-2 h-24 w-11/12 resize-none overflow-auto break-words bg-white border-2  shadow-inner border-gray-200 rounded-md"></textarea>
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl">
                <div className="flex  w-1/4 align-middle py-2 justify-center">
                    <label>Email:</label>
                </div>
                <div className="flex  w-3/4 align-middle justify-start">
                    <textarea id="email" className="p-2 h-24 w-11/12 resize-none overflow-auto break-words bg-white border-2  shadow-inner border-gray-200 rounded-md"></textarea>
                </div>
            </div>
            <div className="flex flex-row w-4/6 mx-9 my-3  rounded-2xl justify-end">
                <div className="flex w-1/4 align-middle py-2 pr-10 justify-center">
                    <InsertNewTask refetchTasks={refetchTasks}/>
                </div>
            </div>
       </div>
       {/* active tasks table */}
       <div className="bg-slate-200 w-11/12 mt-7 rounded-3xl border border-slate-400 shadow-lg divide-black overflow-hidden mb-32 ">
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-slate-600 text-left text-white">
                            <th className="p-2">#</th>
                            <th className="p-2">Requester</th>
                            <th className="p-2">Task To</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Final Date n Time</th>
                            <th className="p-2">Comment</th>
                            <th className="p-2">File Link</th>
                            <th className="p-2">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks.map((item) =>{
                        return(
                            <React.Fragment>
                        <tr key={item.task_id} className={` border-b hover:bg-slate-200 
                        ${expandedTasks.includes(item.task_id)
                            ? 'bg-green-300 hover:bg-green-300' 
                            : new Date() > new Date(item.task_finaltimedate)
                                ? 'bg-red-300'
                                : 'bg-white'
                        }`} onClick={() => showHistory(item.task_id)}>
                            <td className="p-2 pl-5 border-b border-slate-300">{item.task_id}</td>
                            <td className="p-2 border-b border-slate-300">{item.task_requester}</td>
                            <td className="p-2 border-b border-slate-300">{item.task_to}</td>
                            <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_description}</td>
                            <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(item.task_finaltimedate), 'd. M. HH:mm')}</td>
                            <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_comment}</td>
                            <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_filelink}</td>
                            <td className="p-2 border-b border-slate-300 max-w-150px truncate">{item.task_email}</td>
                        </tr>
                        {expandedTasks.includes(item.task_id) && (
                            <tr>
                              <td colSpan="10">
                                <div className="bg-gray-100 p-2">
                                  <table className="w-full">
                                    <thead>
                                      <tr>
                                        <th colSpan="2" className="py-4">History tasks for: {item.task_id}</th>
                                      </tr>
                                      <tr>                                        
                                        <th className="p-2">Change made</th>
                                        <th className="p-2">By</th>
                                        <th className="p-2">Requester</th>
                                        <th className="p-2">Tak to</th>
                                        <th className="p-2">Description</th>
                                        <th className="p-2">Final Date n Time</th>
                                        <th className="p-2">Comment</th>
                                        <th className="p-2">File Link</th>
                                        <th className="p-2">Email</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {tasksHistory
                                        .filter(
                                          (historyTask) =>
                                            historyTask.history_task_id === item.task_id
                                        )
                                        .map((historyTask) => {
                                          return (
                                            <tr key={historyTask.history_id}>
                                              
                                              <td className="p-2  pl-5 border-b border-slate-300 w-32">{format(new Date(historyTask.history_date_time), 'd. M. HH:mm')}</td>
                                              <td className="p-2 border-b border-slate-300 text-center">{historyTask.history_user_id}</td>
                                              <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_requester}</td>
                                              <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_to}</td>
                                              <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{historyTask.task_description}</td>
                                              <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(historyTask.task_finaltimedate), 'd. M. HH:mm')}</td>
                                              <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{historyTask.task_comment}</td>
                                              <td className="p-2 border-b border-slate-300 max-w-250px text-justify break-words">{historyTask.task_filelink}</td>
                                              <td className="p-2 border-b border-slate-300 max-w-150px truncate">{historyTask.task_email}</td>
                                            </tr>
                                          );
                                        })}
                                    </tbody>
                                  </table>
                                </div>
                              </td>
                            </tr>
                          )}
                          </React.Fragment>
                        )}
                        )} 
                    </tbody>
                </table>
            </div>  
    </div>
    );
}

export default AddNew;
