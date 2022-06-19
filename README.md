# Exam #1: Study Plan
## Student: s305571 Freni Davide Giovanni 

## React Client Application Routes

- Route ``: Layout route &rarr; Route with no path that wraps with a common layout the children routes /login, / and /edit. 
- Route `/login`: Here I show up only the full list of courses and if the user click on the Login button, at the top of the page (in the right side), it is shown also the login form.
Once the user insert the right credentials, we navigate to the next route (/), which is the homepage when the user is authenticated.
(Unauthenticated users can only access this route)
- Route `/`: page content and purpose, param specification
- Route `/edit`: page content and purpose
- Route `*`: Special route that will match only when no other routes in our React app do &rarr; Displays a warning and a button to return to the home page.

## API Server

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

- Table `courses` - contains code name credits max_students preparatory_course
- Table `students` - contains id email surname name hash salt time_status
- Table `selection` - contains course_code student_id
- Table `incompatibilities` - contains course_code incompatible_with


<details>
  <summary>Click to see how the tables were created!</summary>
  
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

</details>

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

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

