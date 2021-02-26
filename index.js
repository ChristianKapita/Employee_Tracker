//Import Modules
const mysql=require('mysql');
const inquirer=require("inquirer");
const promisemysql=require("promise-mysql");
require("console.table");

//Connection properties
const connectionProperties={

        host: "localhost",
        port: 3306,
        user: "root",
        password: "@87@ZIpi@@",
        database: "Employee_db"
}

//Creating connection
const connection=mysql.createConnection(connectionProperties);
connection.connect(function(err){
    if(err) throw err;
    console.log("Connected successfuly to Database");
    mainPrompt();
})

//Main Menu for the appp
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
                viewPrompt();
                break;
            case "Add" :
                addDataTable();
                break;
            case "Update" :
                UpdateDataTable();
                break;
            //  case "Remove" :
            //     console.log("Wanna Remove");
            //      break;
             case "Quit" :
                console.log("Good Bye");
                //var test=getDepartmentChoice();
                connection.end();
                break;
                
        }
    })
}

//Function to diplay all departments, Roles and employees
function viewPrompt()
{
    inquirer.prompt(
        [
            {
                message: "View",
                type: "list",
                name: "table_name",
                choices:[{name:"All Employees",value:"employee"},{name:"All Departments",value:"department"},{name:"All Roles",value:"role"},{name:"Department Salary budget",value:"budget"}]
            }
        ]).then(answer=>{
           if(answer.table_name==="employee"){
            //connection.query("select first_name as 'Fisrt Name', last_name as 'Last Name',title as 'Title', name as 'Department', salary from employee emp1 join role on emp1.role_id=role.id join department on role.department_id=department.id group by role.id order by emp1.first_name;",function(err,result){
                connection.query("SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, concat(m.first_name, ' ' ,  m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY ID ASC",function(err,result){
            if(err) throw err;
                console.log("          --ALL EMPLOYEES INFORMATION--");
                console.log(" ")
                console.table(result);
                mainPrompt();
            })

              
           }
           else if(answer.table_name==="department"){
               connection.query("select id, name as 'List of Departments' from department",function(err,result){
                if(err) throw err;
                console.log(" ")
                console.table(result);
                mainPrompt();  
               })
           }
           else if(answer.table_name==="role"){
            connection.query("SELECT title AS 'Position', name AS 'Department', salary AS 'Salary', COUNT(employee.role_id) AS 'Total Employees' FROM role LEFT OUTER JOIN department ON role.department_id = department.id LEFT OUTER JOIN employee ON employee.role_id = role.id GROUP BY role.id order by role.title ASC;",function(err,result){
             if(err) throw err;
             console.log("       --ALL ROLES INFORMATION--");
             console.log(" ")
             console.table(result);
             mainPrompt();  
            })
            }
            else if(answer.table_name==="budget")
            {
                viewDptBudget();
            }
        })
}

//
function addDataTable(){
    inquirer.prompt([
        {
            message: "What do you want to add?",
            name: "table_name",
            type: "list",
            choices: [
                {
                    name: "New Employee",
                    value: "employees"
                },
                {
                    name: "New Role",
                    value: "roles"
                },
                {
                    name: "New Department",
                    value: "departments"
                },
                {
                    name: "Back to Main Menu",
                    value: "mainMenu"
                }
            ]
        }
    ]).then(answers => {

        if (answers.table_name === "mainMenu") return mainPrompt();
        //return createPrompt(answers.table_name);
        else if(answers.table_name === "departments")
        {
            addDepartment();
        }
        else if (answers.table_name === "roles"){
            addRole();

        }
        else if(answers.table_name === "employees"){
            addEmployee();
        }
    }
    );


}

//Update prompt
function UpdateDataTable(){
    inquirer.prompt([
        {
            message: "What do you want to add?",
            name: "table_name",
            type: "list",
            choices: [
                {
                    name: "Update employee role",
                    value: "employees"
                }
            ]
        }
    ]).then(answers => {

     if(answers.table_name === "employees"){
        updateEmployeeRole();
        }
    }
    );


}

//Function to add deparment 
function addDepartment(){
    inquirer.prompt([
        {
            message : " Departement Name :",
            name:"name"
        }
    ]).then (answers=>{
        connection.query("INSERT INTO department SET ?",{
            name:answers.name
        },
        function(err,res){
            if(err) throw err;
            console.log(res.affectedRows + "Department inserted!\n");
            mainPrompt();  
        }
        )

    })
}

//Function to add roles
async function addRole(){
    // Create array of departments
    let departmentArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {

        // Query all departments
        return conn.query('SELECT id, name FROM department ORDER BY name ASC');

    }).then((departments) => {
        
        // Place all departments in array
        for (i=0; i < departments.length; i++){
            departmentArr.push(departments[i].name);
        }

        return departments;
    }).then((departments) => {
        
        inquirer.prompt([
            {
                // Prompt user role title
                name: "roleTitle",
                type: "input",
                message: "Role title: "
            },
            {
                // Prompt user for salary
                name: "salary",
                type: "number",
                message: "Salary: "
            },
            {   
                // Prompt user to select department role is under
                name: "dept",
                type: "list",
                message: "Please select the Department: ",
                choices: departmentArr
            }]).then((answer) => {

                // Set department ID variable
                let deptID;

                // get id of department selected
                for (i=0; i < departments.length; i++){
                    if (answer.dept == departments[i].name){
                        deptID = departments[i].id;
                    }
                }

                // Added role to role table
                connection.query(`INSERT INTO role (title, salary, department_id)
                VALUES ("${answer.roleTitle}", ${answer.salary}, ${deptID})`, (err, res) => {
                    if(err) return err;
                    console.log(`\n ROLE ${answer.roleTitle} ADDED...\n`);
                    mainPrompt();  
                });

            });

    });
}

//function to add Employee
function addEmployee(){

    let roleArr = [];
    let managerArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {

        // Query  all roles and all manager. Pass as a promise
        return Promise.all([
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, managers]) => {

        // Place all roles in array
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        // place all managers in array
        for (i=0; i < managers.length; i++){
            managerArr.push(managers[i].Employee);
        }

        return Promise.all([roles, managers]);
    }).then(([roles, managers]) => {

        // add option for no manager
        managerArr.unshift('--');

        inquirer.prompt([
            {
                // Prompt user of their first name
                name: "firstName",
                type: "input",
                message: "First name: ",
                // Validate field is not blank
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                // Prompt user of their last name
                name: "lastName",
                type: "input",
                message: "Lastname name: ",
                // Validate field is not blank
                validate: function(input){
                    if (input === ""){
                        console.log("**FIELD REQUIRED**");
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            {
                // Prompt user of their role
                name: "role",
                type: "list",
                message: "What is their role?",
                choices: roleArr
            },{
                // Prompt user for manager
                name: "manager",
                type: "list",
                message: "Who is their manager?",
                choices: managerArr
            }]).then((answer) => {

                // Set variable for IDs
                let roleID;
                // Default Manager value as null
                let managerID = null;

                // Get ID of role selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                // get ID of manager selected
                for (i=0; i < managers.length; i++){
                    if (answer.manager == managers[i].Employee){
                        managerID = managers[i].id;
                    }
                }

                // Add employee
                connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${managerID})`, (err, res) => {
                    if(err) return err;

                    // Confirm employee has been added
                    console.log(`\n EMPLOYEE ${answer.firstName} ${answer.lastName} ADDED...\n `);
                    mainPrompt();
                });
            });
    });

}

//Function to update employee role
function updateEmployeeRole(){
    let employeeArr = [];
    let roleArr = [];

    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties
    ).then((conn) => {
        return Promise.all([

            // query all roles and employee
            conn.query('SELECT id, title FROM role ORDER BY title ASC'), 
            conn.query("SELECT employee.id, concat(employee.first_name, ' ' ,  employee.last_name) AS Employee FROM employee ORDER BY Employee ASC")
        ]);
    }).then(([roles, employees]) => {

        // place all roles in array
        for (i=0; i < roles.length; i++){
            roleArr.push(roles[i].title);
        }

        // place all empoyees in array
        for (i=0; i < employees.length; i++){
            employeeArr.push(employees[i].Employee);
            //console.log(value[i].name);
        }

        return Promise.all([roles, employees]);
    }).then(([roles, employees]) => {

        inquirer.prompt([
            {
                // prompt user to select employee
                name: "employee",
                type: "list",
                message: "Who would you like to edit?",
                choices: employeeArr
            }, {
                // Select role to update employee
                name: "role",
                type: "list",
                message: "What is their new role?",
                choices: roleArr
            },]).then((answer) => {

                let roleID;
                let employeeID;

                /// get ID of role selected
                for (i=0; i < roles.length; i++){
                    if (answer.role == roles[i].title){
                        roleID = roles[i].id;
                    }
                }

                // get ID of employee selected
                for (i=0; i < employees.length; i++){
                    if (answer.employee == employees[i].Employee){
                        employeeID = employees[i].id;
                    }
                }
                
                // update employee with new role
                connection.query(`UPDATE employee SET role_id = ${roleID} WHERE id = ${employeeID}`, (err, res) => {
                    if(err) return err;

                    // confirm update employee
                    console.log(`\n ${answer.employee} ROLE UPDATED TO ${answer.role}...\n `);

                    // back to main menu
                    mainPrompt();
                });
            });
    });
}

function viewDptBudget(){
    // Create connection using promise-sql
    promisemysql.createConnection(connectionProperties)
    .then((conn) => {
        return  Promise.all([

            // query all departments and salaries
            conn.query("SELECT department.name AS department, role.salary FROM employee e LEFT JOIN employee m ON e.manager_id = m.id INNER JOIN role ON e.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department ASC"),
            conn.query('SELECT name FROM department ORDER BY name ASC')
        ]);
    }).then(([deptSalaies, departments]) => {
        
        let deptBudgetArr =[];
        let department;

        for (d=0; d < departments.length; d++){
            let departmentBudget = 0;

            // add all salaries together
            for (i=0; i < deptSalaies.length; i++){
                if (departments[d].name == deptSalaies[i].department){
                    departmentBudget += deptSalaies[i].salary;
                }
            }

            // create new property with budgets
            department = {
                Department: departments[d].name,
                MonthlyBudget: departmentBudget
            }

            // add to array
            
            deptBudgetArr.push(department);
        }
        console.log("\n");

        // display departments budgets using console.table
        console.table(deptBudgetArr);

        // back to main menu
        mainPrompt();
    });

}