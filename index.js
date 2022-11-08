const fs = require("fs/promises");
const inquirer = require("inquirer");
const mysql2 = require("mysql2");
const cTable = require("console.table");

const connection = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "Shamck2814!MbDi01!)",
  database: "company_db",
});

function showChoices() {
  inquirer.prompt([
    {
      type: "list",
      name: "selection",
      message: "Please make a choice below",
      choices: [
        "View All Employees",
        "Add Employee",
        "View All Roles",
        "Add Role",
        "View All Departments",
        "Add Department",
        "View All Employees",
        "Add Employee",
        "Update Employee(s) Role",
        "Quit",
      ],
    },
  ]);
}

function addToTable(category, data) {
  switch (category) {
    case "department":
      connection
        .promise()
        .execute(`INSERT INTO departments (department_name) VALUES ("${data}")`)
        .then(() => {
          console.log("\n");
          console.log(`Added ${data} to Departments Table in Database`);
          console.log("\n");
          showChoices();
        });
      break;

    case "role":
      connection
        .promise()
        .query(
          "SELECT id FROM departments WHERE department_name = " +
            "'" +
            data.department +
            "'" +
            ";"
        )
        .then(([rows]) => {
          connection
            .promise()
            .execute(
              "INSERT INTO roles (title, salary, department_id) VALUES (" +
                "'" +
                data.name +
                "'" +
                "," +
                data.salary +
                "," +
                rows[0].id +
                ");"
            );
          console.log("\n");
          console.log(
            `Added ${data.name} with a salary of ${data.salary} to the Roles Table`
          );
          console.log("\n");
          showChoices();
        });
      break;

    case "employee":
      let manager = data.manager.split(" ");
      let roleID;
      let managerID = "NULL";
      connection
        .promise()
        .query(
          "SELECT id FROM roles WHERE title = " + "'" + data.role + "'" + ";"
        )
        .then(([rows]) => {
          roleID = rows[0].id;

          if (data.manager !== "None") {
            connection
              .promise()
              .query(
                "SELECT id FROM employees WHERE first_name = " +
                  "'" +
                  manager[0] +
                  "'" +
                  " AND last_name = " +
                  "'" +
                  manager[1] +
                  "'" +
                  ";"
              )
              .then(([rows]) => {
                managerID = rows[0].id;
                connection
                  .promise()
                  .execute(
                    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (" +
                      "'" +
                      data.first_name +
                      "'" +
                      "," +
                      "'" +
                      data.last_name +
                      "'" +
                      "," +
                      roleID +
                      "," +
                      managerID +
                      ");"
                  );
                console.log("\n");
                console.log(
                  `Added ${
                    data.first_name + " " + data.last_name
                  } with a role of ${data.role} and ${
                    data.manager
                  } as their Manager to the Employees table`
                );
                console.log("\n");
                showChoices();
              });
          } else if (data.manager === "None") {
            connection
              .promise()
              .execute(
                "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (" +
                  "'" +
                  data.first_name +
                  "'" +
                  "," +
                  "'" +
                  data.last_name +
                  "'" +
                  "'" +
                  roleID +
                  "'" +
                  managerID +
                  ");"
              );
            console.log("\n");
            console.log(
              `Added ${data.first_name + " " + data.last_name} with a role of ${
                data.role
              } to the Employees table`
            );
            console.log("\n");
            showChoices();
          }
        });
      break;

    default:
      console.log("Uh oh!");
  }
}
