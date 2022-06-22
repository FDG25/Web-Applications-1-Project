import { Course } from "./course";

const APIURL = 'http://localhost:3001/api/v1';


//o 1)Retrieve the list of all the available courses:
async function getAllCourses() {
    const url = APIURL + '/courses';
    try {
        const response = await fetch(url);
        if (response.ok) {
            // process the response
            const list = await response.json();  
            const coursesList = list.map((c)=>new Course(c.code, c.name, c.credits, c.max_students, c.preparatory_course, c.no_stds, c.incompat));
            return coursesList;
        } else {
            // application error (404, 500, ...)
            console.log(response.statusText);
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        // network error
        console.log(ex);
        throw ex;
    }
}

// 2)Retrieve the list of all the courses of the currently logged-in user:
async function getAllUserCourses() {
  const url = APIURL + `/students/current/courses`;  
  try {
      const response = await fetch(url, {
          credentials: 'include',
      });
      if (response.ok) {
          const list = await response.json();  
          const coursesList = list.map((c)=>new Course(c.code, c.name, c.credits, c.max_students, c.preparatory_course, c.no_stds, c.incompat));
          return coursesList;
      } else {
          console.log(response.statusText);
          const text = await response.text();
          throw new TypeError(text);
      }
  } catch (ex) {
      console.log(ex);
      throw ex;
  }
}

//o )Retrieve a course, given its code:
/*
async function getCourseByCode(code) {  
  const url = APIURL + `/courses/${code}`; 
  try {
      const response = await fetch(url, {
          credentials: 'include',
      });
      if (response.ok) {
          const rawObject = await response.json();  
          const course = new Course(rawObject.code, rawObject.name, rawObject.credits, rawObject.max_students, rawObject.preparatory_course, rawObject.no_stds, rawObject.incompat);
          return course;
      } else {
          console.log(response.statusText);
          const text = await response.text();
          throw new TypeError(text);
      }
  } catch (ex) {
      console.log(ex);
      throw ex;
  }
} */

// 3)Update the time status of the currently logged-in student
async function updateUserStatus(status) {
  const url = APIURL + `/students/current/${status}`;
  try {
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (response.ok) {
          return true;
      } else {
          const text = await response.text();
          throw new TypeError(text);
      }
  } catch (ex) {
      throw ex;
  }
}

//o 4)Save the changes made by the user after editing the study plan and pressing "Save"
async function saveStudyPlan(courses) {
  const url = APIURL + `/students/current/courses`;
  try {
      const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(courses),
          headers: {
              'Content-Type': 'application/json'
          },
          credentials: 'include'
      });
      if (response.ok) {
          return true;
      } else {
          const text = await response.text();
          throw new TypeError(text);
      }
  } catch (ex) {
      throw ex;
  }
}

//o 5)Delete all the courses of the currently logged-in student
async function deleteStudyPlan() {
  const url = APIURL + `/students/current/courses`;
  try {
      const response = await fetch(url, {
          method: 'DELETE',
          credentials: 'include'
      });
      if(response.ok) {
          return true;
      } else {
          const text = await response.text();
          throw new TypeError(text);
      }
  } catch(ex) {
      throw ex;
  }
}

//AUTHENTICATION AND AUTHORIZATION MECHANISMS:
const logIn = async (credentials) => {
  const url = APIURL + '/sessions';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};
  
const getUserInfo = async () => {
  const url = APIURL + '/sessions/current';
  const response = await fetch(url, {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;  
  }
};
  
const logOut = async() => {
  const url = APIURL + '/sessions/current';
  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}
  
//
const getUserById = async () => {
  const url = APIURL + '/sessions/current/info';
  const response = await fetch(url, {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; 
  }
};
  
const API = {getAllCourses, getAllUserCourses, updateUserStatus, saveStudyPlan, deleteStudyPlan, logIn, getUserInfo, logOut, getUserById};
//export {getAllCourses, getAllUserCourses, ...};

export default API;
