Task list website

Admin page
  - on this page admin can create new accounts for other admins or workers, see all tasks as finished as active with all of its history.
  - admins can also change names and amount of departments which are being used on other pages as filter.


Requester page
  - is accesible to anyone, who can create a task with expected end date and time, department, description and emails of interested people in the problem.
  - on this page also everyone see preview of all active tasks


Worker page
  - on this page workers can see, update, finish active tasks.
  - each task has its own email column of people, and after cliking on this string outlook app automatically pop-up with predefined data in the email ready to be sent.
  - after clicking finish btn, when the api server recieves the request to set the task as finished it automatically sends email with powershell script to the requester.

Api server is node.js
  - using express.js to set up urls
  - pg library to access postgresql database.
  - socket.io to establish permanent connection with to workers and admins and whenever is made a change to any task socket.io server sends to needed clients an event, which tells them to refetch data
  

Made by Pavel Hujer 2023.
