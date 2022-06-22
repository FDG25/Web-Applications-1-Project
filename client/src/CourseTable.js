import { useState } from "react";
import { Alert, Col, Row, Table } from "react-bootstrap";
import StudyPlanActions from "./StudyPlanActions";
import CourseRow from "./CourseRow";

function CourseTable(props) {
    const [errorMsg, setErrorMsg] = useState(false);

    let totalCredits = undefined;
    if(props.userCourses){
        totalCredits = props.userCourses.map(uc => uc.credits).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    }

    return <>
        <Row className="justify-content-center" style={{marginTop: '4rem'}}>
            <Col xs={12} sm={10} md={10} lg={10} xl={10} xxl={10}>
                {props.mode ==="courses-list" && <h1>List of Courses</h1>}
                {props.mode ==="study-plan-change" && <h1>Your Study Plan</h1>}
                {props.mode ==="study-plan-edit" && <h1><i>Select the courses of your interest.</i></h1>}
                {props.mode ==="study-plan-edit" && <h4>{props.userTimeStatus === "ft" ? "Status: FT student." : "Status: PT student."}</h4>}
                {props.mode ==="study-plan-edit" && 
                <h4>{props.userTimeStatus === "ft" ? "Min: 60, Max: 80," : "Min: 20, Max: 40,"}  Current: {totalCredits}. <span style={{fontSize: "0.9rem"}}>(Number of Credits)</span></h4>}

                {(props.mode==="study-plan-change" || props.mode==="study-plan-edit") && 
                <StudyPlanActions mode={props.mode} totalCredits={totalCredits} userTimeStatus={props.userTimeStatus} setUserTimeStatus={props.setUserTimeStatus} userCourses={props.mode ==="study-plan-edit" ? props.userCourses : props.courses} setUserCourses={props.setUserCourses} removeStudyPlan={props.removeStudyPlan} editStudyPlan={props.editStudyPlan} topMargin="-3rem" setErrorMsg={setErrorMsg}/>}
                {props.mode==="study-plan-edit" && errorMsg && <Alert variant="danger" onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert>}

                <Table bordered style={{border: "1px solid lightgray"}}> 
                    <thead>
                        <tr>
                            {props.mode==="study-plan-edit" && <th>Select/Remove</th>}
                            <th className="centered">Code</th>
                            <th className="centered">Name</th>
                            <th className="centered">Credits</th>
                            {props.mode !== "study-plan-change" && <th className="centered">N° of Enrolled Students</th>}
                            {props.mode !== "study-plan-change" && <th className="centered">Maximum N° of Students</th>}
                            {props.mode !== "study-plan-change" && <th colSpan="5" className="centered">Extra</th>}

                        </tr>
                    </thead>
                    <tbody>
                        {props.courses.map((course, i) => { return (<CourseRow key={i} enrolledToMaximum={props.enrolledToMaximum} course={course} courses={props.courses} userCourses={props.userCourses} mode={props.mode} addCourse={props.addCourse} removeCourse={props.removeCourse}></CourseRow>) })}
                    </tbody>
                </Table> 
            </Col>
        </Row>
    </>;
}

export default CourseTable;