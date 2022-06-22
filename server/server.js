'use strict';  

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');

const dao = require('./dao'); // module for accessing the DB

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = express();   
const PORT = 3001;
const PREFIX = '/api/v1';

// set up the middlewares
app.use(morgan('dev')); 
app.use(express.json());  

// set up and enable cors  
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
  };
app.use(cors(corsOptions));


// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await dao.getUser(username, password)
    if(!user)
      return cb(null, false, 'Incorrect username or password.');
      
    return cb(null, user);
}));
  
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) { 
    return cb(null, user);
});
  
const isLoggedIn = (req, res, next) => {  //EXPRESS MIDDLEWARE
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authenticated'});
}
  
app.use(session({
    secret: "Sorry, I have to keep it secret...",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/*** User APIs ***/
app.post(PREFIX + '/sessions', passport.authenticate('local'), (req, res) => {
    res.status(201).json(req.user);
});
  
app.get(PREFIX + '/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.json(req.user);}
    else
      res.status(401).json({error: 'Not authenticated'});
});
  
app.delete(PREFIX + '/sessions/current', (req, res) => {
    req.logout(() => {
      res.end();
    });
});

//app.use(isLoggedIn); 
 
//
app.get(PREFIX + '/sessions/current/info', isLoggedIn, (req, res) => {  
    dao.getUserById(req.user.id).then(
      (value) => {
          res.json(value);
      }
  ).catch(
      (err) => {
          res.status(500).json({ error: err });
      }
  );
});


/*** Course APIs ***/  
//o 1)Retrieve the list of all the available courses:
app.get(PREFIX + '/courses', (req, res) => {  
    dao.getAllCourses().then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    );
});

// 2)Retrieve the list of all the courses of the currently logged-in user:
app.get(PREFIX + '/students/current/courses', isLoggedIn, (req, res) => { 
  dao.getAllUserCourses(req.user.id).then(   
      (value) => {
          res.json(value);
      }
  ).catch(
      (err) => {
          res.status(500).json({ error: err });
      }
  );
});

//o )Retrieve a course, given its code:
/*
app.get(PREFIX + '/courses/:code', isLoggedIn, (req, res) => {
    dao.ByCode(req.params.code).then(
        (value) => {
            res.json(value);
        }
    ).catch(
        (err) => {
            res.status(500).json({ error: err });
        }
    );
});
*/

// 3)Update the time status of the currently logged-in student
app.patch(PREFIX + '/students/current/:status', isLoggedIn, async (req, res) => {  
  if (req.params.status === "ft" || req.params.status === "pt" || req.params.status === "null") {
    try {
        await dao.updateUserStatus(req.user.id, req.params.status);
        res.end();
    } catch (e) {
        res.status(400).json({ error: e });
    }
  } else {
    return res.status(400).json({ error: "Time status is not valid" });
  }
});

//o 4)Save the changes made by the user after editing the study plan and pressing "Save"
app.post(PREFIX + '/students/current/courses', isLoggedIn, async (req, res) => {
  const coursesList = req.body;
  if(coursesList){ 
      /*The total number of credits of the study plan can range from 60 to 80 credits for FT, or from 20 to 40 credits for PT.*/
      /*let totalCredits = coursesList.map(uc => uc.credits).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      if((req.user.time_status == "ft" && (totalCredits < 60 || totalCredits > 80)) || (req.user.time_status == "pt" && (totalCredits < 20 || totalCredits > 40))){
          return res.status(400).json({ error: "The total number of credits is out of range!"});
      } */
         
      for (let i = 0; i < coursesList.length; i++){
        /*Each course is characterized by a unique 7-characters code*/
        if(coursesList[i].code.length !== 7){
          return res.status(400).json({ error: "Courses' codes are not valid" });
        }
        /*CHECK ON COURSES THAT ARE NOT COMPATIBLE AMONG THEM*/ 
        if(((coursesList.map((uc) => {
            if (uc.incompat && uc.incompat.indexOf(",")!=-1){
                return (uc.incompat.split(","));
            }else{
                return uc.incompat;
            }
        })).flat(1)).includes(coursesList[i].code)) {  
            return res.status(400).json({ error: "This study plan is not valid --> There are some incompatibilities!" });
        }
      }
  } else{
    return res.status(400).json({ error: "Courses' codes not found" });
  }
  
  try {
      await dao.saveStudyPlan(coursesList, req.user.id);
      res.end();
  } catch (e) {
      res.status(400).json({ error: e });
  }
});


//o 5)Delete all the courses of the currently logged-in student
app.delete(PREFIX + '/students/current/courses', isLoggedIn, (req, res) => {  
    dao.deleteStudyPlan(req.user.id).then(
      () => {
          res.end();
      }
  ).catch(
      (err) => {
          res.status(500).json({ error: err });
      }
  );
});
  
// activate the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});