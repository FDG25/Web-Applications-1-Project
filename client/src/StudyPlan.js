
import CourseTable from './CourseTable';
import { SelectStatus } from './SelectStatus';

function StudyPlan(props) {
    return(
        <>
        {(props.userTimeStatus ==="ft" || props.userTimeStatus ==="pt") ? 
        <CourseTable mode="study-plan-change" userTimeStatus={props.userTimeStatus} setUserTimeStatus={props.setUserTimeStatus} courses={props.courses} removeStudyPlan={props.removeStudyPlan}/> 
        : <SelectStatus setUserTimeStatus={props.setUserTimeStatus}/>}
        </>
    )
  }

export { StudyPlan };
