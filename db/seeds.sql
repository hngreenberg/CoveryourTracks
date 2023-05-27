USE employee_tracker;

INSERT INTO department (name)
VALUES ('CUSTOMER SUPPORT'),
       ('MARKETING'),
       ('SALES'),
       ('ENGINEERING');

INSERT INTO role (title, salary, department_id)
VALUES ('Support Manager', 90000, 1),
       ('Support Specialist', 80000, 1),
       ('Marketing Manager', 100000, 2),
       ('Marketing Spealist', 70000, 2),
       ('Sales Manager', 110000, 3),
       ('Sales Lead', 60000, 3),
       ('Front End Developer', 120000, 4),
       ('Back End Developer', 130000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Ben', 'Baker', 9, NULL),
       ('Leslie', 'Lynn', 8, 1 ),
       ('Frank', 'Fern', 7, 2 ),
       ('Joe', 'Smith', 6, 3 ),
       ('Lindsey', 'Jones', 5, 4 ),
       ('Hanna', 'Brown', 4, 5 ),
       ('Heather', 'Greenberg', 3, 6 ),
       ('Sarah', 'Johnson', 2, 7 );

