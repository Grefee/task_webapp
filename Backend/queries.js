const dotenv = require('dotenv').config({ path: '../.env' });
const fs = require('fs');
const { Pool } = require('pg');
const email = require('./email')


const pool = new Pool({
    user: process.env.BACKEND_DB_USER,
    host: process.env.BACKEND_DB_HOST,
    database: process.env.BACKEND_DB_DATABASE,
    password: process.env.BACKEND_DB_PASS,
    port: process.env.BACKEND_DB_PORT,
  });

pool.connect()

//** ADMIN USERS */

const createUser = (request, response) => {
    const username = request.body.username
    const password = request.body.password
    const userType = request.body.userType
    const user_active = 1

    const query = 'INSERT INTO public.users(user_name, user_password, user_acctype, user_active) VALUES($1, $2, $3, $4) RETURNING user_id';
    const values = [username, password, userType, user_active];
    pool.query(query, values, (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json({message: `User : ${username} was created`});
    })
}

function getAllUsers(){
    const query = 'SELECT user_id, user_name, user_password, user_active, user_acctype FROM public.users';
    return pool.query(query)
        .then(res => res.rows)
        .catch(err => { throw err })

}

const activateUser = (request, response) => {
    const user_id = request.body.user_id;
  
    const query = 'SELECT user_active FROM public.users WHERE user_id = $1';
    pool.query(query, [user_id], (error, results) => {
      if (error) {
        throw error;
      }
      const isActive = results.rows[0].user_active;
      let newActive;
      if (isActive === 0) {
        newActive = 1;
      } else {
        newActive = 0;
      }
      const updateQuery = 'UPDATE public.users SET user_active = $2 WHERE user_id = $1';
      pool.query(updateQuery, [user_id, newActive], (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json({message: `User ${user_id} activated: ${newActive === 1}`});
      });
    });
  }
 
    
  const changePassword = (request, response) => {
    const user_id = request.body.user_id;
    const new_password = request.body.user_password

    const query = 'UPDATE public.users SET user_password = $2 WHERE user_id = $1';
    pool.query(query, [user_id, new_password], (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).json({message: `User's : ${user_id},  password changed`});
      });
    }


//** ADMIN TASKS */


function getHistoryTasks(){
    const query = `
    SELECT history_id, history_task_id, history_user_id, history_date_time, task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show
	FROM public.history`;
    return pool.query(query)
        .then(res => res.rows)
        .catch(err => { throw err })
}
///////////  INSERT UPDATE    ////////////


function insertNewTask(taskX) {
    const jsonString = taskX
    const task = JSON.parse(jsonString);
    const values = [
        task.requester,
        task.taskTo,
        task.priority,
        task.desc,
        task.finalDateTime,
        task.status,
        task.fileLink,
        task.email,
        task.show,
        task.creationDateTime
      ]
    const query = `INSERT INTO public.tasks (task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show, task_creation_time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING task_id`;
    return pool.query(query, values)
        .then(res => {
			const task_id = res.rows[0].task_id;
			const queryHis = `INSERT INTO public.history (
                history_task_id, 
                history_user_id, 
                history_date_time, 
                task_requester,
                task_to, 
                task_priority, 
                task_description,
                task_finaltimedate, 
                task_status, 
                task_filelink, 
                task_email, 
                task_show)
			VALUES ($1, 0, $11, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
			const valuesHis = [
				task_id,
				task.requester,
				task.taskTo,
				task.priority,
				task.desc,
				task.finalDateTime,
				task.status,
				task.fileLink,
				task.email,
				task.show,
				task.creationDateTime
			  ]
			return pool.query(queryHis, valuesHis)
				.then(res => res.rows[0])
				.catch(err => { throw err });				
		})
        .catch(err => { throw err });
}

const findUser = async (username) => {
    const query = `SELECT user_id, user_name, user_password, user_active, user_acctype FROM public.users WHERE user_name = '${username}'`;
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (err) {
      console.log(err);
      return null;
    }
  };

const login = (request, response, callback) => {
    const username = request.body.username
    const pw = request.body.password
    const query = `SELECT *
	                FROM public.users
                    WHERE user_name = $1;`
    pool.query(query, [username], (error, result) => {
        if (error) {
            throw error; 
        }
        if (result.rows.length === 0) {
            response.status(401).json({ message: "User not found" });
            return;
        }

        const user = result.rows[0]

        if (pw !== user.user_password){
            response.status(401).json({ message: "Wrong password" });
            return;
        } else if (user.user_active !== 1){
            response.status(401).json({ message: "User not active" });
            return;
        } else
        callback(user);

    })
};
//////////////////////////////////////////////////
//////////////////////////////////////////////////
/////////////     NEW SCRIPTS    /////////////////
//////////////////////////////////////////////////
//////////////////  EVERYONE  ////////////////////
//////////////////////////////////////////////////
///////////////////  INSET ///////////////////////
//////////////////////////////////////////////////


const createNewTask = (request, response) => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const utcPlusOneDate = date.toISOString();
    const values = [
        request.body.requester,
        request.body.taskTo,
        request.body.description,
        request.body.finalDateTime,
        request.body.email,
        request.body.fileLink,
        utcPlusOneDate,
        "",
        1,
    ];
    
    const query = `
        INSERT INTO public.tasks(
            task_requester, 
            task_to, 
            task_description, 
            task_finaltimedate,
            task_email,
            task_filelink,
            task_creation_time,
            task_comment,
            task_show)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING task_id
    `;
    
    pool.query(query, values, (error, results) => {
        if (error) {
            throw error;
        }
        const task_id = results.rows[0].task_id;

        const historyValues = [
            task_id,
            request.body.requester,
            request.body.taskTo,
            request.body.description,
            request.body.finalDateTime,
            request.body.email,
            request.body.fileLink,
            utcPlusOneDate,
            'task created',
            1,
        ];
        
        const historyQuery = `
            INSERT INTO public.history(
                history_task_id,
                task_requester,
                task_to,
                task_description,
                task_finaltimedate,
                task_email,
                task_filelink,
                history_date_time,
                task_comment,
                task_show)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        `;
        
        pool.query(historyQuery, historyValues, (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows);

        });
    });
};
const getActiveTasks = (request, response) => {
    const query = `
    SELECT 
        task_id, 
        task_requester, 
        task_to, 
        task_priority, 
        task_description, 
        task_finaltimedate, 
        task_status, 
        task_filelink, 
        task_email, 
        task_show, 
        task_creation_time, 
        task_finished_date_time, 
        task_comment
	FROM public.tasks
    WHERE task_show = 1
    ORDER BY task_finaltimedate ASC;
    `;
    pool.query(query, [], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}


const getFinishedTasks = (request, response) => {
    const query = `
    SELECT 
        task_id, 
        task_requester, 
        task_to, 
        task_priority, 
        task_description, 
        task_finaltimedate, 
        task_status, 
        task_filelink, 
        task_email, 
        task_show, 
        task_creation_time, 
        task_finished_date_time, 
        task_comment
	FROM public.tasks
    WHERE task_show = 0
    ORDER BY task_finaltimedate ASC;
    `;
    pool.query(query, [], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
}


const updateTask = (request, response) => {
    const user = request.body.updatedUser
    const task_id = request.body.updatedTask_id   
    const task_to = request.body.updatedTaskt_To
    const task_finaltimedate = request.body.updatedTask_finaltimedate
    const task_commentF = request.body.updatedTask_comment
    console.log(request.body)
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const utcPlusOneDate = date.toISOString();
    const query = `
    SELECT 
        task_id, 
        task_requester, 
        task_to, 
        task_priority, 
        task_description, 
        task_finaltimedate, 
        task_status, 
        task_filelink, 
        task_email, 
        task_show, 
        task_creation_time, 
        task_finished_date_time, 
        task_comment
	FROM public.tasks
    WHERE task_id = $1
    `;
    pool.query(query, [task_id], (error, results) => {
        if (error) {
            throw error;
        }
        old_task = results.rows[0];
        const queryHistory = `
        INSERT INTO public.history(
             history_task_id,
             history_user_id, 
             history_date_time, 
             task_requester, 
             task_to, 
             task_priority, 
             task_description, 
             task_finaltimedate, 
             task_status, 
             task_filelink, 
             task_email, 
             task_show, 
             task_comment
             )
            VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
        `
        pool.query(queryHistory, [
            old_task.task_id,
            user,
            utcPlusOneDate,
            old_task.task_requester,
            task_to,
            old_task.task_priority,
            old_task.task_description,
            task_finaltimedate,
            old_task.task_status,
            old_task.task_filelink,
            old_task.task_email,
            old_task.task_show,
            task_commentF
        ], (error, results) => {
            if (error) {
                throw error;
            }
            const queryUpdateActiveTask = `
            UPDATE public.tasks
            SET  task_to=$2, task_finaltimedate=$3, task_comment=$4
            WHERE task_id=$1;
            `
            pool.query(queryUpdateActiveTask, [task_id, task_to, task_finaltimedate, task_commentF], (error, results) => {
                if (error) {
                    throw error;
                }
                response.status(200).json();
            });
        });
    });
}


const finishTask = (request, response) => {
    const date = new Date();
    date.setHours(date.getHours() + 1);
    const utcPlusOneDate = date.toISOString();
    const finishedComment = 'finish btn clicked'
    console.log(request.body)
    const task_id = request.body.task_id 
    const user = request.body.updatedUser
    const finishTaskQuery = `
    UPDATE public.tasks
            SET  task_show=0, task_finished_date_time=$2
            WHERE task_id=$1;    
    `
    pool.query(finishTaskQuery, [task_id, utcPlusOneDate], (error, results) => {
        if (error) {
            throw error;
        }
        const query = `
                SELECT 
                    task_id, 
                    task_requester, 
                    task_to, 
                    task_priority, 
                    task_description, 
                    task_finaltimedate, 
                    task_status, 
                    task_filelink, 
                    task_email, 
                    task_show, 
                    task_creation_time, 
                    task_finished_date_time, 
                    task_comment
                FROM public.tasks
                WHERE task_id = $1
                `;
        pool.query(query, [task_id], (error, results) => {
            if (error) {
                throw error;
            }
            old_task = results.rows[0];
            const queryHistory = `
            INSERT INTO public.history(
                history_task_id,
                history_user_id, 
                history_date_time, 
                task_requester, 
                task_to, 
                task_priority, 
                task_description, 
                task_finaltimedate, 
                task_status, 
                task_filelink, 
                task_email, 
                task_show, 
                task_comment)
               VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);
           `
           pool.query(queryHistory, [
               old_task.task_id,
               user,
               utcPlusOneDate,
               old_task.task_requester,
               old_task.task_to,
               old_task.task_priority,
               old_task.task_description,
               old_task.task_finaltimedate,
               old_task.task_status,
               old_task.task_filelink,
               old_task.task_email,
               old_task.task_show,
               finishedComment
           ], (error, results) => {
               if (error) {
                   throw error;
               }
               email.sendFinishEmail([
                old_task.task_id,
                user,
                utcPlusOneDate,
                old_task.task_requester,
                old_task.task_to,
                old_task.task_priority,
                old_task.task_description,
                old_task.task_finaltimedate,
                old_task.task_status,
                old_task.task_filelink,
                old_task.task_email,
                old_task.task_show,
                finishedComment
            ]);
               response.status(200).json();
        });  
    });
});  
}


const getActiveHistory = (request, response) => {
    const query = `
SELECT history_id, history_task_id, history_user_id, history_date_time, task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show, task_comment
FROM public.history
WHERE task_show = 1
`
pool.query(query, [], (error, results) => {
    if (error) {
        throw error;
    }
    response.status(200).json(results.rows);
});
}


const getFinishedHistory = (request, response) => {
    const query = `
SELECT history_id, history_task_id, history_user_id, history_date_time, task_requester, task_to, task_priority, task_description, task_finaltimedate, task_status, task_filelink, task_email, task_show, task_comment
FROM public.history
`
pool.query(query, [], (error, results) => {
    if (error) {
        throw error;
    }
    response.status(200).json(results.rows);
});
}


const destroyTask = (request, response) => {
    const task_id = request.body.task_id
    const query = `DELETE FROM public.tasks
    WHERE task_id = $1`;
    pool.query(query, [task_id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json();
    });
}


const reOpenTask = (request, response) => {
    const task_id = request.body.task_id
    const query = `
    UPDATE public.tasks
    SET  task_show=1
    WHERE task_id = $1`;
    pool.query(query, [task_id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json();
    });
}


const changeOptions = (request, response) => {
    const updatedFilter = request.body.filter;

    // read variables from JSON file
    const variables = JSON.parse(fs.readFileSync('E:/warehouse_newTasks/frontend/src/variables.json'));
  
    // update filter key with new values
    variables.filter = updatedFilter;
  
    // write updated variables to JSON file
    fs.writeFile('E:/warehouse_newTasks/frontend/src/variables.json', JSON.stringify(variables), err => {
      if (err) {
        console.error(err);
        response.status(500).send('Error updating variables');
      } else {
        response.send('Variables updated successfully');
      }
    }); 
  }


module.exports = {
    login,

    createUser,
    getAllUsers,
    activateUser,
    changePassword,
    
    //all
    getActiveTasks,
    getFinishedTasks,

    createNewTask,
    //shiftleaders
    updateTask,
    finishTask,

    getActiveHistory,
    getFinishedHistory,

    destroyTask,
    reOpenTask,

    changeOptions

}
