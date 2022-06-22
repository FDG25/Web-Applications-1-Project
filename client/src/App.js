import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Col, Row} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';

import API from './API';
import { Layout } from './Layout';
import { LoginRoute } from './AuthComponents';
import { StudyPlan } from './StudyPlan';
import CourseTable from './CourseTable';

function App() {
  const [courses, setCourses] = useState([]);  // an array of objects of type Course
  const [userCourses, setUserCourses] = useState([]);
  //const [waiting, setWaiting] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [userTimeStatus, setUserTimeStatus] = useState(null);
  const [enrolledToMaximum, setEnrolledToMaximum] = useState([]);
  const [showLoginForm, setShowLoginForm] = useState(false);

  async function reloadCourses() {
    const list = await API.getAllCourses();
    setCourses(list);
    //setWaiting(false);
  }

  async function reloadUserCourses() {
    const listOfUserCourses = await API.getAllUserCourses();
    setUserCourses(listOfUserCourses);
    setEnrolledToMaximum(listOfUserCourses.filter(uc => uc.no_stds === uc.max_students).map(uc => uc.code));
    const user = await API.getUserById();
    setUserTimeStatus(user.time_status);
    //setWaiting(false);
  }
  
  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo();
      setLoggedIn(true);
    };
    if(loggedIn){  
      checkAuth();  
    }
    //console.log(process.env.NODE_ENV);  //TO CHECK IF WE ARE IN development mode! --> THIS console.log() WILL PRINT development.
    }, [loggedIn]);

  useEffect(()=>{
    reloadCourses();
    if(loggedIn){
      reloadUserCourses();
     }
  }, [loggedIn]);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name} ${user.surname}!`, type: 'success'});
      setUserTimeStatus(user.time_status);
    } catch(err) {
      console.log(err + '- Not authorized: incorrect email address or password');
      setMessage({msg: 'Not authorized: incorrect email address or password', type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    // CLEAN UP: 
    setCourses([]);
    setUserCourses([]);
    setMessage('');
    setUserTimeStatus(null);
    setEnrolledToMaximum([]);
  };
  
  const addCourse = (course) => {
    setUserCourses((oldCourses)=>[...oldCourses, course]);
  }

  const removeCourse = (code) => {
    setUserCourses((oldCourses)=>(oldCourses.filter((c)=>(c.code!==code))));
  }

  const editStudyPlan = async (courses) => {
    try{	
      //setWaiting(true);
      await API.updateUserStatus(userTimeStatus);
      await API.deleteStudyPlan();
      await API.saveStudyPlan(courses);
      reloadCourses();  
      reloadUserCourses();
      //setWaiting(false);  
    } catch(e) {
      throw(e);  
    }
  }

  const removeStudyPlan = async () => {
    try{	
      //setWaiting(true);
      await API.updateUserStatus(null);
      await API.deleteStudyPlan();
      reloadCourses(); 
      setUserCourses([]);
      setUserTimeStatus(null);
      setEnrolledToMaximum([]);
      //setWaiting(false); 
    } catch(e) {
        throw(e);
    }
  }

  return (
      <>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout courses={courses} loggedIn={loggedIn} showLoginForm={showLoginForm} setShowLoginForm={setShowLoginForm} message={message} setMessage={setMessage} logout={handleLogout}/>}>
                <Route path='/login' element={
                  loggedIn ? <Navigate replace to='/' /> : (showLoginForm && <LoginRoute login={handleLogin} message={message} setMessage={setMessage} setShowLoginForm={setShowLoginForm}/>)
                }></Route>
                <Route path='/' element={
                  loggedIn ? <StudyPlan setUserTimeStatus={setUserTimeStatus} mode="study-plan-change" userTimeStatus={userTimeStatus} courses={userCourses} removeStudyPlan={removeStudyPlan}/> : <Navigate replace to='/login'/>
                }/>
                <Route path='/edit' element={ loggedIn ? <CourseTable mode="study-plan-edit" userTimeStatus={userTimeStatus} enrolledToMaximum={enrolledToMaximum} courses={courses} userCourses={userCourses} setUserCourses={setUserCourses} addCourse={addCourse} removeCourse={removeCourse} editStudyPlan={editStudyPlan}/> : <Navigate replace to='/login' />}></Route>
            </Route>
            <Route path='*' element={ <DefaultRoute/> } />
          </Routes>
        </BrowserRouter>
      </>
  );
}

function DefaultRoute() {
  return(
    <>
      <Row className="justify-content-center" style={{marginTop: "8rem"}}>
        <Col xs={6} sm={5} md={4} lg={4} xl={4} xxl={3}>
          <h1>Nothing here...</h1>
          <p style={{marginBottom: "4rem"}}>This is not the route you are looking for!</p>
          <Link to="/">
            <Button type="button" variant="dark" className="btn btn-lg edit-button">Go back to the homepage</Button>
          </Link>
        </Col>
      </Row>
    </>
  );
}

export default App;

