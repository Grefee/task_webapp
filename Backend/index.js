const { instrument } = require('@socket.io/admin-ui');
const queries = require('./queries');


const express = require('express');
const app = express();

const http = require("http");
const { Server } = require("socket.io")

const cors = require('cors');
const sessionMiddleware = require('socket.io-session');
const session = require('express-session')
const bcrypt = require('bcrypt');
const { eachMonthOfInterval } = require('date-fns');
const port = 7777


const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true,
    allowEIO3: true
  },
  // Enable debug mode
  debug: true
});

app.use(express.json())
app.use(cors())
 

// SOCKET IO HERE
io.on("connection", (socket) => {
  console.log(`user connected with: ${socket.id}`)
  socket.emit('test','pepega')

  socket.on('from_fronted', (msg)=> {
    console.log(msg)
    socket.broadcast.emit('vracim_back', {message: 'mrdko'})
  })

  app.post('/login', (request, response) => {
    queries.login(request, response, (user) => {
      const acctype = user.user_acctype;
      const username = user.user_name;

      response.status(200).json({ user_name: username, acc_type: acctype });
    });
  });

  app.post('/createNewTask', (request, response) => {
    queries.createNewTask(request, response, () => {});
      socket.broadcast.emit('fetch_active', {message: 'from create fetchuju active'})
    });


  app.post('/updateTask', (request, response) => {
    queries.updateTask(request, response, () => {});
    socket.broadcast.emit('fetch_active', {message: 'from update fetchuju active'})
  });

  app.post('/finishTask', (request, response) => {
    queries.finishTask(request, response, () => {});
    socket.broadcast.emit('fetch_active', {message: 'from finish fetchuju active'})
    socket.broadcast.emit('fetch_finished', {message: ' from finish fetchuju finished'})
  });

  app.post('/reOpenTask', (request, response) => {
    queries.reOpenTask(request, response, () => {});
    socket.broadcast.emit('fetch_active', {message: 'from reopen fetchuju active'})
    socket.broadcast.emit('fetch_finished', {message: 'from reopen fetchuju finished'})
  });

  app.post('/destroyTask', (request, response) => {
    queries.destroyTask(request, response, () => {});
    socket.broadcast.emit('fetch_finished', {message: 'from destroy fetchuju finished'})
  });

  app.post('/createUser', (request, response) => {
    queries.createUser(request, response, () => {});
    socket.broadcast.emit('fetch_users', {message: 'from createUser fetchuju users'})
  });
  app.post('/changePassword', (request, response) => {
    queries.changePassword(request, response, () => {});
    socket.broadcast.emit('fetch_users', {message: 'from change fetchuju users'})
  });
  app.post('/activateUser', (request, response) => {
    queries.activateUser(request, response, () => {});
    socket.broadcast.emit('fetch_users', {message: 'from activate fetchuju users'}) 
  });
  //updateOptions
  app.post('/changeOptions', (request, response) => {
    queries.changeOptions(request, response, () => {});
    socket.broadcast.emit('fetch_active', {message: 'from changeOptions fetchuju active'})
    socket.broadcast.emit('fetch_finished', {message: ' from changeOptions fetchuju finished'})
    socket.broadcast.emit('fetch_users', {message: 'from changeOptions fetchuju users'})
  });
});


app.get('/getAllUsers', (req, res) => {
  queries.getAllUsers()
  .then(users => res.status(200).json(users))
  .catch(err => res.status(400).json({ message: err.message }));
}) 


app.get('/getActiveTasks', queries.getActiveTasks)
app.get('/getFinishedTasks', queries.getFinishedTasks)


app.get('/getActiveHistory', queries.getActiveHistory)
app.get('/getFinishedHistory', queries.getFinishedHistory)


server.listen(port, () => {
  console.log('Server listening on port 7777');
});


instrument(io, {
  auth: false
});
