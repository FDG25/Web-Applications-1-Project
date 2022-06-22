import { Link, useNavigate } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { FaEdit } from 'react-icons/fa';
import { BsTrash } from 'react-icons/bs';
import API from './API';


function StudyPlanActions(props) {
    const navigate = useNavigate();

    const handleSave = async (event) => {
        if((props.userTimeStatus === "ft" && (props.totalCredits >= 60 && props.totalCredits <= 80)) || (props.userTimeStatus === "pt" && (props.totalCredits >= 20 && props.totalCredits <= 40))){
            try{
                await props.editStudyPlan(props.userCourses);
                props.setErrorMsg('');
                navigate('/');
            } catch(e){
                throw(String(e)); 
            }
        }
        else{
            event.stopPropagation(); 
            if((props.userTimeStatus === "ft" && (props.totalCredits < 60)) || (props.userTimeStatus === "pt" && (props.totalCredits < 20))){
                props.setErrorMsg('The total number of credits is out of range: add more courses!');
            }
            if((props.userTimeStatus === "ft" && (props.totalCredits > 80)) || (props.userTimeStatus === "pt" && (props.totalCredits > 40))){
                props.setErrorMsg('The total number of credits is out of range: remove some courses!');
            }
        }
    }

    async function reloadUserCourses() {
        const listOfUserCourses = await API.getAllUserCourses(); 
        props.setUserCourses(listOfUserCourses);
    }
    
    const handleDelete = async () => {
        try{
            if(props.userCourses && props.userCourses.length > 0){
                await props.removeStudyPlan();
            }
            props.setUserTimeStatus(null);
        } catch(err){
            console.log(err);
        }
    }

    const handleCancel = () => {
        reloadUserCourses();
        props.setErrorMsg('');
        navigate('/');
    }

    return (
        <div align='right' style={{marginTop: props.topMargin, marginBottom: "0.8rem"}}>
            {props.mode === "study-plan-edit" ? 
            (<Button variant='success' className='btn-lg' style={{marginRight: "1rem"}} onClick={(event) => handleSave(event)}>Save</Button>) 
            : 
            (<Link to="/edit"><Button variant='success' className='btn-lg' style={{marginRight: "1rem"}}><FaEdit color="black" size="1.5rem"/></Button></Link>)
            }
            {props.mode === "study-plan-edit" ? 
            <Button variant='danger' className='btn-lg' onClick={handleCancel}>Cancel</Button>
            :
            <Button variant='danger' className='btn-lg' onClick={() => handleDelete()}><BsTrash color="black" size="1.5rem"/></Button>
            } 
        </div>
    )
}

export default StudyPlanActions;