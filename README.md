# Exam #1: Study Plan
## Student: s305571 Freni Davide Giovanni 

## React Client Application Routes

- Route ` `: Layout route &rarr; Route with no path that wraps with a common layout the children routes `/login`, `/` and `/edit` &rarr; Made by a header, the full list of courses and a footer.
- Route `/login`: Shows up the full list of courses and a "Login" button that when clicked displays the login form. (Unauthenticated users can only access this route and the "no match" one) &rarr; Once the user enters the right credentials, if the login is successful, we navigate to the route `/`. 
- Route `/`: If the currently logged-in user hasn’t already created his own study plan, he may create an empty one by specifying the full-time or
part-time option. On the contrary, if a study plan has been created yet and has been persistently saved, it is showed up in the same page and can be edited directly (clicking on the edit icon we navigate to `/edit`). Furthermore, clicking on the trash icon the user can decide to delete his study plan and start from scratch deciding the time status. &rarr; Under this section dedicated to the study plan is displayed also the full list of courses.
- Route `/edit`: The currently logged-in user can select the courses that he wants to add to his study plan and then apply persistently the changes clicking on "Save". If everything is ok and the study plan can be saved, he is redirected to `/`, where his study plan is showed up with the new updates. During an editing session, the user may also click on "Cancel". In this case the study plan will not be modified. &rarr; The full list of courses is displayed also under this section.
- Route `*`: "No Match" route &rarr; Special route that will match only when no other routes in our React app do &rarr; Displays a warning and a button to return to the home page.

## API Server

- POST `/api/v1/sessions`
  - Request body: credentials (username and password).
  - Response body: JSON of a user that was just validated (Passport will populate the user for us).
- GET `/api/v1/sessions/current`
  - Request body: empty.
  - Response body: JSON of the current user of the current session.
- DELETE `/api/v1/sessions/current`
  - Request body: empty.
  - Response body: empty.
- GET `/api/v1/sessions/current/info`
  - Request body: empty.
  - Response body: JSON of a user.
 
- GET `/api/v1/courses`
  - Request body: empty.
  - Response body: array of Course objects (in JSON).
- GET `/api/v1/students/current/courses`
  - Request body: empty.
  - Response body: array of Course objects (in JSON).
- GET `/api/v1/courses/:code`
  - Request body: empty (the string representing the code is already in the URI).
  - Response body: JSON of a course.
- PATCH `/api/v1/students/current/:status`
  - Request body: empty (the string representing the status is already in the URI).
  - Response body: none (or error description).
- POST `/api/v1/students/current/courses`
  - Request body: array of Course objects (in JSON).
  - Response body: none (or error description).
- DELETE `/api/v1/students/current/courses`
  - Request body: empty.
  - Response body: none (or error description).

## Database Tables

- Table `courses` - contains code name credits max_students preparatory_course &rarr; To store the courses and their features. 
- Table `students` - contains id email surname name hash salt time_status &rarr; To store user related info, including the type of study plan (FT or PT).
- Table `selection` - contains course_code student_id &rarr; To store the courses of each student.
- Table `incompatibilities` - contains course_code incompatible_with &rarr; To store all the incompatibilities between courses.
- Trigger `forbid_insertion` - IN ORDER TO BE SURE THAT THE NUMBER OF ENROLLED STUDENTS IN EACH COURSE DOES NOT EXCEED THE MAXIMUM NUMBER.

<details>
  <summary>Click to see how the tables and the trigger were created!</summary>
  
  <br/>
  
    CREATE TABLE IF NOT EXISTS "courses" (
      "code" TEXT PRIMARY KEY NOT NULL,
      "name" TEXT UNIQUE NOT NULL,
      "credits" INTEGER NOT NULL,
      "max_students" INTEGER,
      "preparatory_course" TEXT,
      FOREIGN KEY (preparatory_course) REFERENCES courses(code)	
      CHECK(
          typeof("code") = "text" AND
          length("code") = 7
      ) );

    CREATE TABLE IF NOT EXISTS "students" (
      "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "surname" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "hash" TEXT NOT NULL,
      "salt" TEXT UNIQUE NOT NULL,       
      "time_status" TEXT );

    CREATE TABLE IF NOT EXISTS "selection" (
      "course_code" TEXT NOT NULL,
      "student_id" INTEGER NOT NULL,
      PRIMARY KEY (course_code, student_id),
      FOREIGN KEY (course_code) REFERENCES courses(code),	
      FOREIGN KEY (student_id) REFERENCES students(id) );

    CREATE TABLE IF NOT EXISTS "incompatibilities" (
      "course_code" TEXT NOT NULL,
      "incompatible_with" TEXT NOT NULL,
      PRIMARY KEY (course_code, incompatible_with),
      FOREIGN KEY (course_code) REFERENCES courses(code),	
      FOREIGN KEY (incompatible_with) REFERENCES courses(code) );

    CREATE TRIGGER forbid_insertion 
    BEFORE INSERT ON selection  
    FOR EACH ROW 
    WHEN 
    (SELECT count(DISTINCT sel.student_id) AS no_stds FROM courses c LEFT JOIN selection sel ON c.code = sel.course_code WHERE sel.course_code = new.course_code            GROUP BY c.code) >= (SELECT c.max_students FROM courses c WHERE c.code = new.course_code)
    BEGIN
      SELECT RAISE(FAIL, "Error! This study plan is not valid -> The maximum number of students for some courses is not respected");
    END;  

</details>

## Main React Components

- `App` (in `App.js`): Returns the JSX of our React application.
- `LoginRoute` (in `AuthComponents.js`): Contains the LoginForm component, which is used to implement the login functionality. When the form is filled in with a 
valid email and a valid password, it can be submitted. 
- `LogoutButton` (in `AuthComponents.js`): Allows to logout from the application and to go back to the login page as an unauthenticated user.
- `StudyPlan` (in `StudyPlan.js`): Exploits conditional rendering to show up the SelectStatus component or the CourseTable component, based on whether or not a study plan has been created yet.
- `SelectStatus` (in `SelectStatus.js`): Enables the user to specify the full-time or part-time option for his study plan.
- `CourseTable` (in `CourseTable.js`): Borns to show up the full list of courses, but it has also been reused for both editing table and user's study plan. 
- `CourseRow` (in `CourseRow.js`): Makes up the CourseTable component and contains CourseData and CourseActions component (contained in the same file). 
CourseData is where we display courses data, whereas CourseAction contains the buttons that enable us to select/remove a course from our study plan. 
- `StudyPlanActions` (in `StudyPlanActions.js`): While editing the study plan, contains buttons for saving/canceling changes made. While displaying a study plan, are shown buttons for editing/deleting a study plan.

Minor Components:
- `Layout` (in `Layout.js`)
- `Header` (in `Header.js`)
- `Footer` (in `Footer.js`)

## Screenshot

* Error messages are showed up when hovering over the alert icons.
* I handled the maximum number of enrolled students in such a way that, when editing the study plan, the user can select/deselect a course for which he has taken one of the available slots. Whereas, if a user hasn't already added in his study plan a course that is full, he will not be able to select/deselect this one until someone else removes it from his study plan.
* The border is not part of the website but it has been added to the screenshot only

![Screenshot](../main/screenshot.jpg)
 <br/>
## Users Credentials

| username (email) | password | time_status |
|------------------|----------|-------------|
| giuseppe@polito.it | password | ft |
| leonardo@polito.it | password | ft |
| giulia@polito.it | password | pt |
| sofia@polito.it | password | pt |
| aurora@polito.it | password | NULL |
| chiara@polito.it | password | NULL |

  * Passwords were not stored explicitly in the database -> A secure password hashing function (scrypt, included in the crypto module) has been used.
  * The password is the same for all the students.
However, considering that a unique salt was used for each user, we got different hashes.

