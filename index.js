const mysql=require('mysql');
const inquirer=require("inquirer");
require("console.table");

const connection=mysql.createConnection(
    {

  host: "localhost",
  port: 3306,
  user: "root",
  password: "@87@ZIpi@@",
  database: "Employee_db"
    }
)
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected successfuly to Database");
    mainPrompt();
})

var mainPrompt=()=>{
    inquirer.prompt([
        {
            message:"What do you want to do?",
            type:"list",
            name:"whatToDo",
            choices:["View","Add","Update","Remove","Quit"]
        }
    ]).then (answer =>{
        switch(answer.whatToDo){
            case "View" :
                console.log("Wanna View");
                viewPrompt();
                break;
            case "Add" :
                console.log("Wanna Add");
                break;
            case "Update" :
                 console.log("Wanna Update");
                break;
             case "Remove" :
                console.log("Wanna Remove");
                 break;
             case "Quit" :
                console.log("Good Bye");
                connection.end();
                break;
        }
    })
}

function viewPrompt()
{
    inquirer.prompt(
        [
            {
                message: "View",
                type: "list",
                name: "table_name",
                choices:[{name:"All Employees",value:"employee"},{name:"All Departments",value:"department"},{name:"All Roles",value:"role"}]
            }
        ]).then(answer=>{
           if(answer.table_name==="employee"){
               console.log("View all employees");
           }
        })
}