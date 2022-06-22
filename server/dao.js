'use strict';

const { db } = require('./db');
const { Course } = require('./course');
const crypto = require('crypto');


function getUser(email, password) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM students WHERE email = ?';
    db.get(query, [email.toLowerCase()], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.id, username: row.email, surname: row.surname, name: row.name, time_status: row.time_status};
        
        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};

function getUserById(id) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM students WHERE id = ?';
    db.get(query, [id], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve({error: 'User not found!'}); 
      }
      else {
        const user = {id: row.id, username: row.email, surname: row.surname, name: row.name, time_status: row.time_status};
        resolve(user);
      }
    });
  });
};


//o 1)Retrieve the list of all the available courses:
function getAllCourses() {
  return new Promise((resolve, reject) => {
      const query = 'SELECT c.code, c.name, c.credits, c.max_students, c.preparatory_course, count(DISTINCT s.student_id) AS no_stds, GROUP_CONCAT(DISTINCT i.incompatible_with) AS incompat FROM courses c LEFT JOIN selection s ON c.code = s.course_code LEFT JOIN incompatibilities i ON c.code = i.course_code GROUP BY c.code ORDER BY c.name';  // ORDER BY --> to sort courses by Alphabetical order  //select c.code, c.name, c.credits, c.max_students, c.preparatory_course, count(s.student_id) as no_stds from courses c LEFT JOIN selection s ON c.code = s.course_code group by c.code order by c.name
      db.all(query, [], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const courses = rows.map(record => new Course(record.code, record.name, record.credits, record.max_students, record.preparatory_course, record.no_stds, record.incompat));
          resolve(courses);  
        }
      });
  });
}

// 2)Retrieve the list of all the courses of the currently logged-in user:
function getAllUserCourses(userId) {
  return new Promise((resolve, reject) => {
      const query = 'SELECT c.code, c.name, c.credits, c.max_students, c.preparatory_course, count(DISTINCT sel.student_id) AS no_stds, GROUP_CONCAT(DISTINCT i.incompatible_with) AS incompat, sel.student_id FROM courses c LEFT JOIN selection sel ON c.code = sel.course_code LEFT JOIN incompatibilities i ON c.code = i.course_code LEFT JOIN students stud ON sel.student_id = stud.id WHERE c.code IN (SELECT c.code FROM courses c LEFT JOIN selection sel ON c.code = sel.course_code WHERE sel.student_id = ? GROUP BY c.code) GROUP BY c.code ORDER BY c.name';
      db.all(query, [userId], (err, rows) => {
        if(err) {
          reject(err);
        }
        else {
          const courses = rows.map(record => new Course(record.code, record.name, record.credits, record.max_students, record.preparatory_course, record.no_stds, record.incompat));
          resolve(courses);  
        }
      });
  });
}

//o )Retrieve a course, given its code:
/*
function getCourseByCode(code) {
      return new Promise((resolve, reject) => {
          const query = 'SELECT * FROM courses WHERE code = ?';
          db.get(query, [code], (err, row) => {
              if (err)
                reject(err);
              else{
                  resolve(row);
              }
            });
      });
}
*/
  
// 3)Update the time status of the currently logged-in student
function updateUserStatus(userId, status) {
  return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE students SET time_status = ? WHERE id = ?';
      db.run(updateQuery, [status, userId], (err, rows) => {
        if(err)
          reject(err);
        else
          resolve(true);
      });
    });
}

//o 4)Save the changes made by the user after editing the study plan and clicking "Save"
function saveStudyPlan(coursesList, userId) { 
  /*** SERVER-SIDE VALIDATION ***/
  let error = ""; 

  return new Promise((resolve, reject) => {
    //CHECK ON ENROLLED STUDENTS --> *** IMPORTANT *** BECAUSE THE CLIENT COULD HAVE A VALUE THAT IS NOT UP TO DATE.
    //I CREATED ALSO A DATABASE TRIGGER IN ORDER TO BE SURE THAT THE NUMBER OF ENROLLED STUDENTS IN EACH COURSE DOES NOT EXCEED THE MAXIMUM NUMBER --> DOCUMENTED IN README.md
    /*let max_students = undefined;
    const selectStudentsNumber = 'SELECT c.max_students, count(DISTINCT sel.student_id) AS no_stds FROM courses c LEFT JOIN selection sel ON c.code = sel.course_code WHERE sel.course_code = ? GROUP BY c.code';
    for (let i = 0; i < coursesList.length; i++){
      db.get(selectStudentsNumber, [coursesList[i].code], (err, row) => {
          if (err)
            reject(err);
          else{
            if(row.no_stds){
                if(!row.max_students){
                    max_students = row.no_stds+10;
                }
                if(row.no_stds >= max_students){
                    error = "This study plan is not valid --> The maximum number of students for some courses is not respected";
                }
            }
          }
      });
    } */

    if(error === "") { 
      for (let i = 0; i < coursesList.length; i++){
          const insertQuery = 'INSERT INTO selection VALUES (?, ?)'; 
          const parameters = [coursesList[i].code, userId];
          db.run(insertQuery, parameters, (err) => {
            if(err)
              reject(err);
            else
              resolve(true);
          });
      }
    }
  });
}

//o 5)Delete all the courses of the currently logged-in student
function deleteStudyPlan(userId) {
  return new Promise((resolve, reject) => {
      const deleteQuery = 'DELETE FROM selection WHERE student_id = ?';
      db.run(deleteQuery, [userId], (err, rows) => {
        if(err)
          reject(err);
        else
          resolve(true);
      });
    });
}

// exports.getAllCourses = getAllCourses;
// exports.getAllUserCourses = getAllUserCourses;
// ...
module.exports = { getAllCourses, getAllUserCourses, updateUserStatus, saveStudyPlan, deleteStudyPlan, getUser, getUserById };