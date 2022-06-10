# Exam #1: Study Plan
## Student: s305571 Freni Davide Giovanni 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

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

- Table `users` - contains xx yy zz
- Table `something` - contains ww qq ss
- ...

## Main React Components

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

TABLE 'students'
| username (email) | password | time_status |
|------------------|----------|-------------|
| giuseppe@polito.it | password | ft |
| leonardo@polito.it | password | ft |
| giulia@polito.it | password | ft |
| sofia@polito.it | password | pt |
| aurora@polito.it | password | pt |
| chiara@polito.it | password | NULL |

The password is the same for all the students, but considering that for each user has been used a unique salt (stored in the database), we will get different hashes.

