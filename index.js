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

//
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
            connection.query("select first_name as 'Fisrt Name', last_name as 'Last Name',title as 'Title', name as 'Department', salary from employee emp1 join role on emp1.role_id=role.id join department on role.department_id=department.id group by role.id;",function(err,result){
                if(err) throw err;
                console.log("          --ALL EMPLOYEES INFORMATION--");
                console.log(" ")
                console.table(result);
                mainPrompt();
            })
              
           }
           else if(answer.table_name==="department"){
               connection.query("select name as 'List of Departments' from department",function(err,result){
                if(err) throw err;
                console.log(" ")
                console.table(result);
                mainPrompt();  
               })
           }
           else if(answer.table_name==="role"){
            connection.query("SELECT title AS 'Position', name AS 'Department', salary AS 'Salary', COUNT(employee.role_id) AS 'Total Employees' FROM role LEFT OUTER JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee ON employee.role_id = role.id GROUP BY role.id;",function(err,result){
             if(err) throw err;
             console.log("       --ALL ROLES INFORMATION--");
             console.log(" ")
             console.table(result);
             mainPrompt();  
            })
            }
        })
}