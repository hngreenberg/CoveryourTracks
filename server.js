const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "employee_tracker",
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected to database');
  promptMessages();
});

const promptMessages = () => {
  inquirer.prompt([
    {
      name: 'choices',
      type: 'list',
      message: 'Select an option.',
      choices: [
        'View All Employees',
        'View By Department',
        'View By Manager',
        'View All Roles',
        'Add Employee',
        'Remove Employee',
        'Update Role',
        'Exit'
      ]
    }
  ])
    .then((answers) => {
      console.log('answers', answers);
      switch (answers.choices) {
        case 'View All Employees':
          viewAllEmployees();
          break;

        case 'View By Department':
          viewByDepartment();
          break;

        case 'View By Manager':
          viewByManager();
          break;

        case 'Add Employee':
          addEmployee();
          break;

        case 'Remove Employee':
          removeEmployee('delete');
          break;

        case 'Update Role':
          removeEmployee('role');
          break;

        case 'View All Roles':
          viewAllRoles();
          break;

        case 'Exit':
          db.end();
          break;
      }
    })
    .catch((error) => {
      console.error('error', error);
    });
};

function viewAllEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW ALL EMPLOYEES');
    console.log('\n');
    console.table(res);
    promptMessages();
  });
}

function viewByDepartment() {
  const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW EMPLOYEE BY DEPARTMENT');
    console.log('\n');
    console.table(res);
    promptMessages();
  });
}

function viewByManager() {
  const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager on manager.id = employee.manager_id
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW EMPLOYEE BY MANAGER');
    console.log('\n');
    console.table(res);
    promptMessages();
  });
}

function viewAllRoles() {
  const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
  db.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.log('VIEW EMPLOYEE BY ROLE');
    console.log('\n');
    console.table(res);
    promptMessages();
  });
}

async function addEmployee() {
  const addName = await inquirer.prompt(askName());
  db.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
    if (err) throw err;
    const { role } = await inquirer.prompt([
      {
        name: 'role',
        type: 'list',
        choices: () => res.map(res => res.title),
        message: 'What is the employee role?: '
      }
    ]);
    let roleId;
    for (const row of res) {
      if (row.title === role) {
        roleId = row.id;
        continue;
      }
    }
    db.query('SELECT * FROM employee', async (err, res) => {
      if (err) throw err;
      let choices = res.map(res => `${res.first_name} ${res.last_name}`);
      choices.push('none');
      let { manager } = await inquirer.prompt([
        {
          name: 'manager',
          type: 'list',
          choices: choices,
          message: 'Choose employee Manager: '
        }
      ]);
      let managerId;
      let managerName;
      if (manager === 'none') {
        managerId = null;
      } else {
        for (const data of res) {
          data.fullName = `${data.first_name} ${data.last_name}`;
          if (data.fullName === manager) {
            managerId = data.id;
            managerName = data.fullName;
            console.log(managerId);
            console.log(managerName);
            continue;
          }
        }
      }
      console.log('Employee has been added. Make sure to check All Employees');
      db.query(
        'INSERT INTO employee SET ?',
        {
          first_name: addName.first,
          last_name: addName.last,
          role_id: roleId,
          manager_id: parseInt(managerId)
        },
        (err, res) => {
          if (err) throw err;
          promptMessages();
        }
      );
    });
  });
}

function removeEmployee(input) {
  const promptQ = {
    yes: "yes",
    no: "no"
  };
  inquirer.prompt([
    {
      name: "message",
      type: "list",
      message: "In order to proceed an employee, an ID must be entered. View all employees to get" +
        " the employee ID. Do you know the employee ID?",
      choices: [promptQ.yes, promptQ.no]
    }
  ]).then(answer => {
    if (input === 'delete' && answer.message === "yes") removeEmployeeById();
    else if (input === 'role' && answer.message === "yes") updateRole();
    else viewAllEmployees();
  });
}

async function removeEmployeeById() {
  const answer = await inquirer.prompt([
    {
      name: "id",
      type: "input",
      message: "Enter the employee ID you want to remove: "
    }
  ]);

  db.query('DELETE FROM employee WHERE ?',
    {
      id: answer.id
    },
    function (err) {
      if (err) throw err;
    }
  )
  console.log('Employee has been removed.');
  promptMessages();
}

function askId() {
  return ([
    {
      name: "id",
      type: "input",
      message: "What is the employee ID?: "
    }
  ]);
}

async function updateRole() {
  const { id } = await inquirer.prompt(askId());

  db.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
    if (err) throw err;
    const { role } = await inquirer.prompt([
      {
        name: 'role',
        type: 'list',
        choices: () => res.map(res => res.title),
        message: 'What is the new employee role?: '
      }
    ]);
    let roleId;
    for (const row of res) {
      if (row.title === role) {
        roleId = row.id;
        continue;
      }
    }
    db.query(`UPDATE employee 
    SET role_id = ${roleId}
    WHERE employee.id = ${id}`, async (err, res) => {
      if (err) throw err;
      console.log('Role has been updated..')
      promptMessages();
    });
  });
}

function askName() {
  return ([
    {
      name: "first",
      type: "input",
      message: "Enter the first name: "
    },
    {
      name: "last",
      type: "input",
      message: "Enter the last name: "
    }
  ])
}

promptMessages();
