USE employee_tracker;

INSERT INTO department (name)
VALUES ("CUSTOMER SUPPORT"),
       ("MARKETING"),
       ("SALES"),
       ("ENGINEERING");

INSERT INTO role (title, salary, department_id)
VALUES ("Support Manager", 90000, 1),
       ("Support Specialist", 80000, 1),
       ("Marketing Manager", 100000, 2),
       ("Marketing Spealist", 70000, 2),
       ("Sales Manager", 110000, 3),
       ("Sales Lead", 60000, 3),
       ("Front End Developer", 120000, 4),
       ("Back End Developer", 130000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Ben", "Baker", 9),
       ("Leslie", "Lynn", 8),
       ("Frank", "Fern", 7 ),
       ("Joe", "Smith", 6),
       ("Lindsey", "Jones", 5),
       ("Hanna", "Brown", 4),
       ("Heather", "Greenberf", 3),
       ("Sarah", "Johnson", 2);

