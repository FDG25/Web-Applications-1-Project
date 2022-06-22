import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Alert, Button } from "react-bootstrap";
import { FiAlertTriangle } from 'react-icons/fi';

function CourseRow(props) {
    const [rowErrorMsg, setRowErrorMsg] = useState("");

    //SELECTING THE COURSES THAT ARE ALREADY PART OF THE STUDY PLAN (E.G COURSES INSERTED IN PREVIOUS EDITING SESSIONS):
    let courseIsSelected = false;
    if(props.userCourses && props.userCourses.map(uc => uc.code).includes(props.course.code)){  
        courseIsSelected = true;
    }

    //IT IS NOT POSSIBLE TO REMOVE A COURSE THAT IS PREPARATORY TO ANOTHER COURSE ALREADY SELECTED --> FIRST WE HAVE TO REMOVE THIS SECOND COURSE:
    let message = "";
    let courseNotRemovable = false;    
    let prepCourseCode = undefined;
    let courseCodeWithPrep = undefined;
    if(props.userCourses){    
        prepCourseCode = (props.userCourses.filter((c) => (c.preparatory_course))).map((c) => (c.preparatory_course));
        courseCodeWithPrep = (props.userCourses.filter((c) => (c.preparatory_course))).map((c) => (c.code));
    }
    if(props.userCourses && props.userCourses.map(uc => prepCourseCode.includes(uc.code)) && props.userCourses.map(uc => courseCodeWithPrep.includes(uc.code))){
        let index = prepCourseCode.indexOf(props.course.code);
        if(index !== -1){
            courseNotRemovable = true;
            message = "We cannot remove this course because it is preparatory to " + courseCodeWithPrep[index];  //IN THIS CASE I SHOW UP THE CODE OF THE COURSE IN THE MESSAGE BECAUSE IT IS AN INFORMATION THAT IS NOT WRITTEN IN THE SAME ROW.
        }
    }

    //IT IS NOT POSSIBLE TO SELECT A COURSE THAT HAS REACHED THE MAXIMUM NUMBER OF STUDENTS:
    let courseNotSelectable = false;
    if(props.course.no_stds === props.course.max_students){  
        if(props.enrolledToMaximum && props.enrolledToMaximum.includes(props.course.code)){   //IF THE CURRENT USER HAS TAKEN THE LAST PLACE AVAILABLE FOR A SPECIFIC COURSE, WE MARK THIS ONE AS "SELECTABLE" --> WHILE EDITING, HE IS ABLE TO REMOVE OR SELECT IT, CONSIDERING THAT HE HAS TAKEN THE LAST SLOT AVAILABLE FOR THAT SPECIFIC COURSE.
            courseNotSelectable = false;
            message = "";
        } 
        else{   //IF THE CURRENT USER DOES NOT HAVE IN HIS STUDY PLAN THE COURSES THAT HAVE REACHED THE MAXIMUM NUMBER OF STUDENTS, WE MARK THESE AS "NOT SELECTABLE" (background-color: red) --> WHILE EDITING, THE USER IS NOT ABLE TO SELECT THESE COURSES BECAUSE THEY ARE FULL.
            courseNotSelectable = true;
            courseIsSelected = false;
            message = "This course has reached the maximum number of students!";
        } 
    }
    
    //IT IS NOT POSSIBLE TO ADD A COURSE IF WE HAVEN'T ALREADY ADDED THE PREPARATORY ONE:
    if(((props.courses.filter((c) => (c.preparatory_course))).map((c) => (c.code)).includes(props.course.code))){  
        courseNotSelectable = true;
        message = "First add in the study plan the corresponding preparatory course!";  //+ props.course.preparatory_course TO DISPLAY THE CODE OF THE PREPARATORY COURSE.
        if(props.userCourses && ((props.userCourses.map(uc => uc.code)).includes(props.course.preparatory_course))){  //IT IS POSSIBLE TO ADD A COURSE IF WE HAVE ALREADY ADDED THE PREPARATORY ONE.
            courseNotSelectable = false;
            message = "";
        }
    }

    //IT IS NOT POSSIBLE TO ADD A COURSE THAT IS INCOMPATIBLE WITH THE OTHERS SELECTED:
    if(props.userCourses &&  //THIS RULE IS INSERTED AS THE LAST ONE BECAUSE MAY HAPPEN THAT A COURSE CANNOT BE SELECTED FOR 2 REASONS AT THE SAME TIME: BECAUSE IT IS INCOMPATIBLE WITH ANOTHER ONE AND BECAUSE THE PREPARATORY IS NOT SELECTED --> WE WANT THE INCOMPATIBILITY TO BE THE STRONGEST BETWEEN THE 2 RULES.
    ((props.userCourses.map((uc) => {
        if (uc.incompat && uc.incompat.indexOf(",")!==-1){
            return (uc.incompat.split(","));
        }else{
            return uc.incompat;
        }
    })).flat(1)).includes(props.course.code)) {  
        courseNotSelectable = true;
        message = "This course is not compatible with one of the selected courses!";
    }

    return <>
        <tr className={(props.mode==="study-plan-edit" && courseIsSelected ? "row-greenbackgroundcolor " : "") + (props.mode==="study-plan-edit" && courseNotSelectable ? "row-redbackgroundcolor " : "")}>
            {rowErrorMsg && <td className='popup'><Alert variant='secondary' onClose={() => props.setRowErrorMsg('')}>{message}</Alert></td>}
            {props.mode==="study-plan-edit" && 
            <CourseActions course={props.course} courseIsSelected={courseIsSelected} courseNotSelectable={courseNotSelectable} courseNotRemovable={courseNotRemovable} addCourse={props.addCourse} removeCourse={props.removeCourse} message={message} setRowErrorMsg={setRowErrorMsg}/>}
            <CourseData course={props.course} mode={props.mode}/> 
        </tr>
    </>;
}


function CourseData(props) {
    const [hidden, setHidden] = useState(true);

    const returnExtra = () => {
        if(props.mode === "courses-list"){
            return <>
                {hidden ? (props.mode !== "study-plan-change" &&
                    <td className='centered'><Button type="button" className="btn bg-orange" onClick = {() => setHidden(false)}>More</Button></td>
                ): (props.mode !== "study-plan-change" &&
                    <td className='centered'><Button type="button" variant="dark" className="btn" onClick = {() => setHidden(true)}>Less</Button></td>
                )}
                {hidden ?  <></> : (props.mode !== "study-plan-change" &&
                <>
                    <th className='centered'>Incompatible with:</th>
                    <td className='centered'> {props.course.incompat ? props.course.incompat.split(',').join(', ') : "/"}</td>
                    <th className='centered'>Preparatory Course:</th>
                    <td className='centered'> {props.course.preparatory_course ? props.course.preparatory_course : "/"} </td>
                </>
                )}
            </>
        }
        if(props.mode === "study-plan-edit"){
            return <>
                {props.mode !== "study-plan-change" &&
                <>
                    <th className='centered'>Incompatible with:</th>
                    <td className='centered'> {props.course.incompat ? props.course.incompat.split(',').join(', ') : "/"}</td>
                    <th className='centered'>Preparatory Course:</th>
                    <td className='centered'> {props.course.preparatory_course ? props.course.preparatory_course : "/"} </td>
                </>
                }
            </>
        }
    }
    
    return <>
        <td className='centered'>{props.course.code}</td>
        <td valign='middle'>{props.course.name}</td>
        <td className='centered'>{props.course.credits}</td>
        {(props.mode !== "study-plan-change") && <td className='centered'>{props.course.no_stds}</td>}
        {(props.mode !== "study-plan-change") && <td className='centered'>{props.course.max_students ? props.course.max_students : "/"}</td>}

        {returnExtra()}
    </>;
}


function CourseActions(props) {
    return <td className="same-line">
            <Button variant='success' style={{marginRight: "0.5rem"}} disabled={props.courseIsSelected || props.courseNotSelectable} onClick={()=>{props.addCourse(props.course)}}>&#x271A;</Button>  {/* I GET THE ICONS FROM https://react-icons.github.io/react-icons/ */}
            <Button variant='danger' style={{marginRight: "0.5rem"}} disabled={!props.courseIsSelected || props.courseNotSelectable || props.courseNotRemovable} onClick={()=>{props.removeCourse(props.course.code)}}>&#x2718;</Button>
            {!props.courseIsSelected && props.courseNotSelectable && 
            <Button variant='warning' style={{borderRadius: "100%"}} onMouseEnter= {() => {if(props.courseNotSelectable) props.setRowErrorMsg(props.message)}} onMouseLeave = {() => {if(props.courseNotSelectable) props.setRowErrorMsg("")}}><FiAlertTriangle/></Button>}
            {props.courseIsSelected && props.courseNotRemovable && 
            <Button variant='warning' style={{borderRadius: "100%"}} onMouseEnter= {() => props.setRowErrorMsg(props.message)} onMouseLeave = {() => props.setRowErrorMsg("")}><FiAlertTriangle/></Button>}
    </td> ;
}


export default CourseRow;