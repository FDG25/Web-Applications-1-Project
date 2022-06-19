# Exam #1: Study Plan
## Student: s305571 Freni Davide Giovanni 

## React Client Application Routes

- Route ` `: Layout route &rarr; Route with no path that wraps with a common layout the children routes `/login`, `/` and `/edit` &rarr; Made by a header, the full list of courses and a footer.
- Route `/login`: Shows up the full list of courses and a "Login" button that when clicked displays the login form. (Unauthenticated users can only access this route and the "no match" one) &rarr; Once the user enters the right credentials, we navigate to the route `/`. 
- Route `/`: If the currently logged-in user hasn’t already created his own study plan, he may create an empty one by specifying the full-time or
part-time option. On the contrary, if a study plan has been created yet and has been persistently saved, it is showed up in the same page and can be edited directly (clicking on the edit icon we navigate to `/edit`). Furthermore, clicking on the trash icon the user can also decide to delete his study plan and start from scratch deciding the time status. &rarr; Under this section dedicated to the study plan also the full list of courses is displayed.
- Route `/edit`: The currently logged-in user can select the courses that he wants to add to his study plan and then apply persistently the changes clicking on "Save". If everything is ok and the study plan can be saved, he is directly redirected to `/`, where his study plan is showed up with the new updates. During an editing session, the user may also click on "Delete". In this case the study plan will not be modified. &rarr; Under this editing section also the full list of courses is displayed.
- Route `*`: "No Match" route &rarr; Special route that will match only when no other routes in our React app do &rarr; Displays a warning and a button to return to the home page.

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

- Table `courses` - contains code name credits max_students preparatory_course &rarr; To store the courses and their features. 
- Table `students` - contains id email surname name hash salt time_status &rarr; To store user related info, including the type of study plan (FT or PT).
- Table `selection` - contains course_code student_id &rarr; To store the courses of each student.
- Table `incompatibilities` - contains course_code incompatible_with &rarr; To store all the incompatibilities between courses.


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

