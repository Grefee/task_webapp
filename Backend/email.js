
const nodemailer = require("nodemailer");
const { exec } = require('child_process');
const { parseISO, format } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz');

const sendFinishEmail = (array) => {
    
    const task_id = array[0];
    const user = array[1];
    const timeStampS = array[2];
    const task_requester = array[3];
    const task_to = array[4];
    const task_priority = array[5];
    const task_description = array[6];
    const task_finaltimedate = array[7];
    const task_status = array[8];
    const task_filelink = array[9];
    const task_email = array[10];
    const task_show = array[11];
    const finishedComment = array[12];
    
    const year = timeStampS.slice(0, 4)
    const month = timeStampS.slice(5, 7) // Subtract 1 to get 0-indexed month
    const day = timeStampS.slice(8, 10);
    const hour =timeStampS.slice(11, 13)
    const minute = timeStampS.slice(14, 16)
    const formattedDate = day + ' ' + month + ' ' + year + ' - ' + hour +':' + minute
    let newEmails = task_email.split(";").map(email => email.trim()).join("; "); // split the string by ';' and remove any whitespace around each email, then join the emails with '; ' to ensure there's a space after each email

    exec(`powershell -Command "Send-MailMessage -SMTPServer 172.20.170.37 -To '${newEmails}' -From scm-requests@webasto.com -Subject 'Request of id: ${task_id}' -Body 'This is automatically generated email. Task number: ${task_id} has been marked as solved by user: ${user} , with ${timeStampS} last timestamp: ${formattedDate}'"`, (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('email send succesfully');
      });
}


module.exports = {
    sendFinishEmail
}
