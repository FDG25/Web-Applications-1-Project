import {Row, Button, Alert, Col} from 'react-bootstrap';
import { LogoutButton } from './AuthComponents';


function Header(props) {
    return(
        <>  
            {props.message && props.loggedIn && 
            <Row className="fixed-left-top">
              <Col>
                  <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible>{props.message.msg}</Alert>
              </Col>
            </Row>}
            {props.loggedIn ? 
            <LogoutButton logout={props.handleLogout}/> : 
            <Button type="button" disabled = {props.showLoginForm} variant="dark" className="btn btn-lg fixed-right-top edit-button" onClick={() => {props.setShowLoginForm(true)}}>Login</Button>
            }
            <Row className="justify-content-center header">
              <Col>
                <h1>Exam Assignment:</h1>
                <h1>Study Plan</h1>
              </Col>
            </Row>
        </>
    )
  }

export { Header };