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
const filterArray = variables.filter

async function fetchActiveTasks(IP){
    const response = await fetch(`http://${IP}:${ipPort}/getActiveTasks`, {
        method: 'GET',
        });
        return response.json();
  }

async function fetchFinishedTasks(IP){
    const response = await fetch(`http://${IP}:${ipPort}/getFinishedTasks`, {
        method: 'GET',
        });
        return response.json();
  }


async function fetchActiveHistory(IP) {
    const response = await fetch(`http://${IP}:${ipPort}/getActiveHistory`, {
        method: 'GET',
        });
        return response.json();
  }
async function fetchFinishedHistory(IP) {
const response = await fetch(`http://${IP}:${ipPort}/getFinishedHistory`, {
    method: 'GET',
    });
    return response.json();
}

function UpdatebBtn({item, refetchActiveTasks, refetchFinishedTasks, refetchATasksHistory, refetchFTasksHistory}){
  
    const { status, error, mutate } = useMutation({
      mutationFn: ({id,user, updatedTask_to, updatedTask_finaltimedate, updatedTask_comment}) => {
        return fetch(`http://${IP}:${ipPort}/updateTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "updatedTask_id" : id,
            "updatedUser" : user,
            "updatedTaskt_To" : updatedTask_to,
            "updatedTask_finaltimedate" : updatedTask_finaltimedate,
            "updatedTask_comment": updatedTask_comment
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task changed successfully",
      });
      refetchActiveTasks();
      refetchFinishedTasks();
      refetchATasksHistory();
      refetchFTasksHistory();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to change task",
        }),
    });
  
  
  
      const updateBtn = () => {
          Swal.fire({
              width: 1000,
              title: `Change task number: ${item.task_id}`,
              html: ` 
              <div style="display: flex; flex-direction: column; align-items: center;">
                <div style="display: flex; align-items: center;">
                  <label for="requester" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Requester: </label>
                  <input id="requester" type="text" value="${item.task_requester}" class="swal2-input" style="background-color: rgb(226 232 240)" readonly>
                </div>
  
                <div style="display: flex; align-items: center;">
                <label for="taskTo" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Task To: </label>
                <select name="taskTo" id="taskTo" class="swal2-select" required>
                  <option value="" disabled hidden></option>
                  ${filterArray.map((val, index) => (
                    `<option key=${index} value="${val}" ${val === item.task_to ? 'selected' : ''}>${val}</option>`
                  ))}
                </select>
              </div>
  
                <div style="display: flex; align-items: center;">
                  <label for="task_description" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Description: </label>
                  <textarea id="task_description" class="swal2-textarea" style="width:600px; background-color: rgb(226 232 240)" readonly>${item.task_description}</textarea>
                </div>
  
                <div style="display: flex; align-items: center;">
                  <label for="date" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Date: </label>
                  <input type="date" value="${format(new Date(item.task_finaltimedate), 'yyyy-MM-dd')}" id="date" class="swal2-date">
  
                  <label for="time" style="display: inline-block; margin-right: 10px; margin-left: 10px; font-size: 24px; text-decoration: underline;">Time: </label>
                  <input type="time" value="${format(new Date(item.task_finaltimedate), 'HH:mm')}" id="time" class="swal2-time">
  
                </div>
            
                <div style="display: flex; align-items: center;">
                  <label for="task_comment" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Comment: </label>
                  <textarea id="task_comment" class="swal2-textarea" style="width:600px">${item.task_comment}</textarea>
                </div>
            
                <div style="display: flex; align-items: center;">
                  <label for="task_filelink" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">File Link: </label>
                  <textarea id="task_filelink" class="swal2-textarea" style="width:600px; background-color: rgb(226 232 240)" readonly>${item.task_filelink}</textarea>
                </div>
            
                <div style="display: flex; align-items: center;">
                  <label for="task_email" style="display: inline-block; margin-right: 10px; font-size: 24px; text-decoration: underline;">Email: </label>
                  <textarea id="task_email" class="swal2-textarea" style="width:600px; background-color: rgb(226 232 240)" readonly>${item.task_email}</textarea>
                </div>
              </div>  
              `,
             
           showCancelButton: true,
           confirmButtonText: "Confirm",
           cancelButtonText: "Cancel",      
           preConfirm: async () => {
              let id = item.task_id
              let user = sessionStorage.getItem('user_name')
              let updatedTask_to = document.getElementById('taskTo').value;          
              let time = document.getElementById('time').value
              let date = document.getElementById('date').value
              let updatedTask_finaltimedate =  format(new Date(date + ' ' + time), 'yyyy-MM-dd HH:mm:ss')
  
              let updatedTask_comment = document.getElementById('task_comment').value;
              await mutate({id, user, updatedTask_to, updatedTask_finaltimedate, updatedTask_comment});
  
           },
  
  
    });
       };
      return(
          <button className="button-28" onClick={() => updateBtn(item.task_requester, item.task_to, item.task_description, item.task_comment, item.task_filelink, item.task_email)}>update</button>
      ) 
  }
  
  function FinishBtn({item, refetchActiveTasks, refetchFinishedTasks, refetchATasksHistory, refetchFTasksHistory}){
    
    const { status, error, mutate } = useMutation({
      mutationFn: ({id, user}) => {
        return fetch(`http://${IP}:${ipPort}/finishTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "task_id" : id,
            "updatedUser" : user
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task finished successfully",
      });
      refetchActiveTasks();
      refetchFinishedTasks();
      refetchATasksHistory();
      refetchFTasksHistory();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to finish task",
        }),
    });
  
    const finishBtn = () => {
      Swal.fire({
        width: 800,
        title: `Do you really want to finish task: ${item.task_id}`,
        html: ` 
  
        `,
       
     showCancelButton: true,
     confirmButtonText: "Confirm",
     cancelButtonText: "Cancel",      
     preConfirm: async () => {
        let id = item.task_id
        let user = sessionStorage.getItem('user_name')
        await mutate({id, user});
  
     },
  
  
  });
  };
    return(
      <button className="button-28" onClick={() => finishBtn(item.task_id)}>finish</button>
  ) 
  }

  function ReOpenbBtn({item, refetchActiveTasks, refetchFinishedTasks, refetchATasksHistory, refetchFTasksHistory}){
    
    const { status, error, mutate } = useMutation({
      mutationFn: ({id}) => {
        return fetch(`http://${IP}:${ipPort}/reOpenTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "task_id" : id,
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task reopened successfully",
      });
      refetchActiveTasks();
      refetchFinishedTasks();
      refetchATasksHistory();
      refetchFTasksHistory();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reopen task",
        }),
    });
  
    const reopenBtn = () => {
      Swal.fire({
        width: 800,
        title: `Do you really want to reopen task: ${item.task_id}`,
        html: ` 
  
        `,
       
     showCancelButton: true,
     confirmButtonText: "Confirm",
     cancelButtonText: "Cancel",      
     preConfirm: async () => {
      let id = item.task_id
        await mutate({id});
  
     },
  
  
  });
  };
    return(
      <button className="button-28 max-w-fit" onClick={() => reopenBtn(item.task_id)}>ReOpen</button>
  ) 
  }
  function Destroybtn({item, refetchActiveTasks, refetchFinishedTasks, refetchATasksHistory, refetchFTasksHistory}){
    
    const { status, error, mutate } = useMutation({
      mutationFn: ({id}) => {
        return fetch(`http://${IP}:${ipPort}/destroyTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "task_id" : item.task_id
          }),
        });
      },   
    onSuccess: () => {
      Swal.fire({
      icon: "success",
      title: "Success",
      text: "Task destroyed successfully",
      });
      refetchActiveTasks();
      refetchFinishedTasks();
      refetchATasksHistory();
      refetchFTasksHistory();
    },
    onError: () =>
        Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to destroy task",
        }),
    });
  
    const destroyBtn = () => {
      Swal.fire({
        width: 800,
        title: `Do you really want to destroy task: ${item.task_id}`,
        html: ` 
  
        `,
       
     showCancelButton: true,
     confirmButtonText: "Confirm",
     cancelButtonText: "Cancel",      
     preConfirm: async () => {
  
        await mutate(item.task_id);
  
     },
  
  
  });
  };
    return(
      <button className="button-28 max-w-fit" onClick={() => destroyBtn(item.task_id)}>Destroy</button>
  ) 
  }







function AdminTasks() {
    const socket = useSocket();
    const [expandedTasks, setExpandedTasks] = useState([]);
    const [filter, setFilter] = useState([]);
    const [filterId, setFilterId] = useState([]);
    const [filterRequester, setFilterRequester] = useState([]);
    const {isLoading: activeTaskLoadingStatus, data: activeTasks, refetch: refetchActiveTasks} = useQuery({queryKey: ['activeTasks'], queryFn: async () => await fetchActiveTasks(IP), initialData: []});
    const {isLoading: finishedTaskLoadingStatus, data: finishedTasks, refetch: refetchFinishedTasks} = useQuery({queryKey: ['finishedTasks'], queryFn: async () => await fetchFinishedTasks(IP), initialData: []});
    const {isLoading: taskHistoryALoadingStatus, data: tasksAHistory, refetch: refetchATasksHistory} = useQuery({queryKey: ['tasksAHistory'], queryFn: async () => await fetchActiveHistory(IP), initialData: []});
    const {isLoading: taskHistoryFLoadingStatus, data: tasksFHistory, refetch: refetchFTasksHistory} = useQuery({queryKey: ['tasksFHistory'], queryFn: async () => await fetchFinishedHistory(IP), initialData: []});


    function addFilterItem(e){
        setFilter([...filter, e.target.value]);
    }
    function addFilterById(e){
      let tempFilt = parseInt(document.getElementById('filterId').value)
      setFilterId([...filterId, tempFilt]);
      document.getElementById('filterId').value = '';
    }
    function addFilterByRequester(e){
      let tempFilt = document.getElementById('filterRequester').value;
      setFilterRequester([...filterRequester, tempFilt]);
      document.getElementById('filterRequester').value = '';
    }

    function removeFilter(value) {
      setFilter(filter.filter(val => val !== value));
    }
    function removeFilterById(value){
      setFilterId(filterId.filter(val => val !== value));
    }
    function removeFilterByRequester(value){
      setFilterRequester(filterRequester.filter(val => val !== value));
    }




    function showHistory(task_id) {
      if (expandedTasks.includes(task_id)) {
        setExpandedTasks(expandedTasks.filter(taskId => taskId !== task_id));
      } else {
        setExpandedTasks([...expandedTasks, task_id]);
      }
    };



    useEffect(() => {
      if (socket) {
          // refetch from outside update
          socket.on("fetch_active", (arg) => {
              refetchActiveTasks();
              refetchATasksHistory();
              console.log(arg); 
              });
          socket.on("fetch_finished", (arg) => {
            refetchFinishedTasks();
            refetchFTasksHistory();
            console.log(arg); 
            });
      }
    }, [socket]);

    if (activeTaskLoadingStatus || finishedTaskLoadingStatus || taskHistoryALoadingStatus || taskHistoryFLoadingStatus) {
      return <span>Loading...</span>
      }


return(

    <div className="bg-white w-full h-full flex flex-col items-center">
      <div className="bg-white mt-5 pt-5 pb-20 pr-5 w-11/12 rounded-3xl">

        <div className="pt-5 pb-5">
          <h1 className="text-2xl font-serif underline underline-offset-4">Aktivní tasky</h1>
        </div>
        {/** FILTER */}
        <div className="bg-white mb-5 mt-2 pt-5 pb-5 pl-10 flex flex-row justify-start items-center">
          <div className=" mr-5">
            <select className="rounded-xl p-2 border" name="filter"  id="filter" required onChange={addFilterItem}>
              <option key="" value="" disabled defaultValue hidden></option>
                {filterArray.map((val, index) => (
                  <option key={index} value={val}>{val}</option>
              ))}
            </select> 
          </div>

          <div className="">
            <div className="">
              <label>Selected filters: </label>
              <ul className="bg-white inline-flex">
                  {filter.map((val, index) => (
                      <li className="ml-3 mr-2 p-2 inline-flex shadow-2xl hover:bg-slate-200 rounded-2xl border" key={index}>{val}      
                        <span onClick={() => removeFilter(val)}>
                          <svg className="h-5 w-5 ml-3 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </li>
                  ))}
              </ul>
            </div>
          </div> 
        </div>
        {/** FILTER ID */}
        <div className="bg-white mb-5 mt-2 pt-5 pb-5 pl-10 flex flex-row justify-start items-center">
          <div className=" mr-5">
            <input className="rounded-xl p-2 border max-w-150px mr-4" type="number" placeholder="enter id" id="filterId"></input>
            <button className="button-28 max-w-fit" onClick={addFilterById}>filter</button>
          </div>
        <div className="">
            <div className="">
              <label>Selected filters: </label>
              <ul className="bg-white inline-flex">
                  {filterId.map((val, index) => (
                      <li className="ml-3 mr-2 p-2 inline-flex shadow-2xl hover:bg-slate-200 rounded-2xl border" key={index}>{val}      
                        <span onClick={() => removeFilterById(val)}>
                          <svg className="h-5 w-5 ml-3 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </li>
                  ))}
              </ul>
            </div>
          </div> 
        </div>
        {/** FILTER REQUESTER */}
        <div className="bg-white mb-5 mt-2 pt-5 pb-5 pl-10 flex flex-row justify-start items-center">
          <div className=" mr-5">
            <input className="rounded-xl p-2 border max-w-150px mr-4" placeholder="enter requester" id="filterRequester"></input>
            <button className="button-28 max-w-fit" onClick={addFilterByRequester}>filter</button>
          </div>
        <div className="">
            <div className="">
              <label>Selected filters: </label>
              <ul className="bg-white inline-flex">
                  {filterRequester.map((val, index) => (
                      <li className="ml-3 mr-2 p-2 inline-flex shadow-2xl hover:bg-slate-200 rounded-2xl border" key={index}>{val}      
                        <span onClick={() => removeFilterByRequester(val)}>
                          <svg className="h-5 w-5 ml-3 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="grey" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </span>
                      </li>
                  ))}
              </ul>
            </div>
          </div> 
        </div>
        {/** ACTIVE TASKS*/}
          <div className=" relative border w-full rounded-3xl overflow-hidden">
            <table className="w-full text-black-500 dark:text-gray-400 overflow-hidden ">
              <thead>
                  <tr className="bg-slate-600 text-left text-white">
                  <th className="p-2">#</th>
                  <th className="p-2">Requester</th>
                  <th className="p-2">Task to</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Final Date n Time</th>
                  <th className="p-2">Comment</th>
                  <th className="p-2">File Link</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Update Btn</th>
                  <th className="p-2">Finish Btn</th>
                </tr>
              </thead>
              <tbody>
              {// FILTERED DATA
              activeTasks ?        
              activeTasks.filter((task) => {
                      return(
                        (filter.length === 0 || filter.includes(task.task_to)) &&
                        (filterId.length === 0 || filterId.includes(task.task_id)) &&
                        (filterRequester.length === 0 || filterRequester.includes(task.task_requester))
                      );     
                  }).map((item) => {  
                      return(                 
                      <React.Fragment>
                      <tr key={item.task_id} className={` border-b hover:bg-slate-200  
                      ${expandedTasks.includes(item.task_id)
                        ? 'bg-green-300 hover:bg-green-300' 
                        : new Date() > new Date(item.task_finaltimedate)
                            ? 'bg-red-300'
                            : 'bg-white'
                    }`}  onClick={() => showHistory(item.task_id)}>
                          <td className="p-2  pl-5 border-b border-slate-300">{item.task_id}</td>
                          <td className="p-2 border-b border-slate-300">{item.task_requester}</td>
                          <td className="p-2 border-b border-slate-300">{item.task_to}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_description}</td>
                          <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(item.task_finaltimedate), 'd. M. HH:mm')}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_comment}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify break-words">{item.task_filelink}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px break-words">{item.task_email}</td>
      
                          <td className="px-2 py-2"><UpdatebBtn item={item} refetchActiveTasks={refetchActiveTasks} refetchFinishedTasks={refetchFinishedTasks} refetchATasksHistory={refetchATasksHistory} refetchFTasksHistory={refetchFTasksHistory} /></td>
                          <td className="px-2"><FinishBtn item={item} refetchActiveTasks={refetchActiveTasks} refetchFinishedTasks={refetchFinishedTasks} refetchATasksHistory={refetchATasksHistory} refetchFTasksHistory={refetchFTasksHistory} /></td>
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
                                    <th className="p-2">Requester</th>
                                    <th className="p-2">By</th>
                                    <th className="p-2">Tak to</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2">Final Date n Time</th>
                                    <th className="p-2">Comment</th>
                                    <th className="p-2">File Link</th>
                                    <th className="p-2">Email</th>
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                  {tasksAHistory
                                    .filter(
                                      (historyTask) =>
                                        historyTask.history_task_id === item.task_id
                                    )
                                    .map((historyTask) => {
                                      return (
                                        <tr key={historyTask.history_id}>
                                          
                                          <td className="p-2  pl-5 border-b border-slate-300 w-32 text-center">{format(new Date(historyTask.history_date_time), 'd. M. HH:mm')}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_requester}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.history_user_id}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_to}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify">{historyTask.task_description}</td>
                                          <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(historyTask.task_finaltimedate), 'd. M. HH:mm')}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify">{historyTask.task_comment}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify break-words">{historyTask.task_filelink}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px break-words">{historyTask.task_email}</td>
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
                  );
                })

                  // ALL DATA
              : activeTasks.map((item) => {
                  return(                  
                  <tr key={item.task_id} className={` border-b hover:bg-slate-200 
                  ${expandedTasks.includes(item.task_id)
                    ? 'bg-green-300 hover:bg-green-300' 
                    : new Date() > new Date(item.task_finaltimedate)
                        ? 'bg-red-300'
                        : 'bg-white'
                }`}>
                      <td className="p-2 pl-5 border-b border-slate-300">{item.task_id}</td>
                      <td className="p-2 border-b border-slate-300">{item.task_requester}</td>
                      <td className="p-2 border-b border-slate-300">{item.task_to}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_description}</td>
                      <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(item.task_finaltimedate), 'd. M. HH:mm')}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_comment}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_filelink}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_email}</td>
  
                      <td className="px-6 py-3"><UpdatebBtn item={item} /></td>
                      <td className="px-6 py-3"><button className="button-28">finish</button></td>
                  </tr>








                  )})     
              }
              
              { // filter is but no data
                (filter.length > 0 || filterId.length > 0 || filterRequester.length > 0) && 
                  activeTasks.filter((task) => {
                    return (
                      (filter.length === 0 || filter.includes(task.task_to)) &&
                      (filterId.length === 0 || filterId.includes(task.task_id)) &&
                      (filterRequester.length === 0 || filterRequester.includes(task.task_requester))
                    );
                  }).length === 0 && 
                  <tr className={` border-b  hover:bg-slate-200`}>
                    <td className="px-3 py-3 text-center" colSpan="10">no data found</td>
                  </tr>
              }
              </tbody>
            </table>
          </div>              

      {/** FINISHED TASKS */}
        <div className="pt-5 pb-5">
          <h1 className="text-2xl font-serif underline underline-offset-4">Uzavřené tasky</h1>
        </div>
        
          <div className=" relative border w-full rounded-3xl overflow-hidden">
            <table className="w-full text-black-500 dark:text-gray-400 overflow-hidden ">
              <thead>
                  <tr className="bg-slate-600 text-left text-white">
                  <th className="p-2">#</th>
                  <th className="p-2">Requester</th>
                  <th className="p-2">Task to</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Final Date n Time</th>
                  <th className="p-2">Comment</th>
                  <th className="p-2">File Link</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Reopen Btn</th>
                  <th className="p-2">Destroy Btn</th>
                </tr>
              </thead>
              <tbody>
              {// FILTERED DATA
              finishedTasks ?        
              finishedTasks.filter((task) => {
                  return(
                    (filter.length === 0 || filter.includes(task.task_to)) &&
                    (filterId.length === 0 || filterId.includes(task.task_id)) &&
                    (filterRequester.length === 0 || filterRequester.includes(task.task_requester))
                  );     
                  }).map((item) => {  
                      return(                 
                      <React.Fragment>
                      <tr key={item.task_id} className={` border-b hover:bg-slate-200 ${expandedTasks.includes(item.task_id)
                              ? 'bg-green-300 hover:bg-green-300' 
                              : new Date() > new Date(item.task_finaltimedate)
                                  ? 'bg-white'
                                  : 'bg-white'
                          }`} onClick={() => showHistory(item.task_id)}>
                          <td className="p-2  pl-5 border-b border-slate-300">{item.task_id}</td>
                          <td className="p-2 border-b border-slate-300">{item.task_requester}</td>
                          <td className="p-2 border-b border-slate-300">{item.task_to}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_description}</td>
                          <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(item.task_finaltimedate), 'd. M. HH:mm')}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_comment}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px text-justify break-words">{item.task_filelink}</td>
                          <td className="p-2 border-b border-slate-300 max-w-250px break-words">{item.task_email}</td>
                          <td className="px-2 py-2"><ReOpenbBtn item={item} refetchActiveTasks={refetchActiveTasks} refetchFinishedTasks={refetchFinishedTasks} refetchATasksHistory={refetchATasksHistory} refetchFTasksHistory={refetchFTasksHistory} /></td>
                          <td className="px-2"><Destroybtn item={item} refetchActiveTasks={refetchActiveTasks} refetchFinishedTasks={refetchFinishedTasks} refetchATasksHistory={refetchATasksHistory} refetchFTasksHistory={refetchFTasksHistory} /></td>
                      </tr>
                       
                       {expandedTasks.includes(item.task_id) && (
                        <tr>
                          <td colSpan="10">
                            <div className="bg-gray-100 p-2">
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th colSpan="2" className="py-2">History tasks for: {item.task_id}</th>
                                  </tr>
                                  <tr>
                                    
                                    <th className="p-2">Change made</th>
                                    <th className="p-2">Requester</th>
                                    <th className="p-2">By</th>
                                    <th className="p-2">Tak to</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2">Final Date n Time</th>
                                    <th className="p-2">Comment</th>
                                    <th className="p-2">File Link</th>
                                    <th className="p-2">Email</th>
                                  
                                  </tr>
                                </thead>
                                <tbody>
                                  {tasksFHistory
                                    .filter(
                                      (historyTask) =>
                                        historyTask.history_task_id === item.task_id
                                    )
                                    .map((historyTask) => {
                                      return (
                                        <tr key={historyTask.history_id}>
                                          
                                          <td className="p-2  pl-5 border-b border-slate-300 w-32 text-center">{format(new Date(historyTask.history_date_time), 'd. M. HH:mm')}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_requester}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.history_user_id}</td>
                                          <td className="p-2 border-b border-slate-300 text-center">{historyTask.task_to}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify">{historyTask.task_description}</td>
                                          <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(historyTask.task_finaltimedate), 'd. M. HH:mm')}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify">{historyTask.task_comment}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px text-justify break-words">{historyTask.task_filelink}</td>
                                          <td className="p-2 border-b border-slate-300 max-w-200px break-words">{historyTask.task_email}</td>
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
                  );
                })

                  // ALL DATA
              : finishedTasks.map((item) => {
                  return(                  
                  <tr key={item.task_id} className={` border-b hover:bg-slate-200 
                  ${expandedTasks.includes(item.task_id)
                    ? 'bg-green-300 hover:bg-green-300' 
                    : new Date() > new Date(item.task_finaltimedate)
                        ? 'bg-red-300'
                        : 'bg-white'
                }`}>
                      <td className="p-2 pl-5 border-b border-slate-300">{item.task_id}</td>
                      <td className="p-2 border-b border-slate-300">{item.task_requester}</td>
                      <td className="p-2 border-b border-slate-300">{item.task_to}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px text-justify">{item.task_description}</td>
                      <td className="p-2 border-b border-slate-300 w-40 text-center">{format(new Date(item.task_finaltimedate), 'd. M. HH:mm')}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_comment}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_filelink}</td>
                      <td className="p-2 border-b border-slate-300 max-w-250px">{item.task_email}</td>
  
                      <td className="px-6 py-3"><UpdatebBtn item={item} /></td>
                      <td className="px-6 py-3"><button className="button-28">finish</button></td>
                  </tr>








                  )})     
              }
              
              { // filter is but no data
                (filter.length > 0 || filterId.length > 0 || filterRequester.length > 0) && 
                  !finishedTasks.some(task => {
                    return (
                      (filter.length === 0 || filter.includes(task.task_to)) &&
                      (filterId.length === 0 || filterId.includes(task.task_id)) &&
                      (filterRequester.length === 0 || filterRequester.includes(task.task_requester))
                    ); 
                  }) && 
                  <tr className={` border-b  hover:bg-slate-200`}>
                          <td className="px-3 py-3 text-center" colSpan="10">no data found</td>
                      </tr>
              }
              </tbody>
            </table>
          </div>          
        </div>

      </div>   
    )
}


    
export default AdminTasks;