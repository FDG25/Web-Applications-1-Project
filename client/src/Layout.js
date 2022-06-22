import { Header } from './Header';
import { Outlet } from 'react-router-dom';
import CourseTable from './CourseTable';
import { Footer } from './Footer';


function Layout(props) {
    return(
        <>        
            <Header loggedIn={props.loggedIn} showLoginForm={props.showLoginForm} setShowLoginForm={props.setShowLoginForm} message={props.message} setMessage={props.setMessage} handleLogout={props.logout}/>
            <Outlet/>
            <CourseTable mode="courses-list" courses={props.courses} loggedIn={props.loggedIn}/>
            <Footer/>
        </>
    )
  }

export { Layout };