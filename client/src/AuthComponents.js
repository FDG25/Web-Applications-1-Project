import { useState } from 'react';
import { Form, Button, Row, Col, CloseButton } from 'react-bootstrap';
import { Alert } from 'react-bootstrap';


function LoginForm(props) {
  const [username, setUsername] = useState('');  //EMAIL
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const validateEmail = (email) => {
    if (/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)){  // REGEX --> The email should be properly formatted (i.e., something@something.something).
        setError(''); 
    } else {
        setError("You entered an invalid email address!");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    validateEmail(username);
    if(error === ''){
      event.preventDefault();
      const credentials = { username, password };
      
      props.login(credentials);
    }
  };

  return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='username' style={{marginTop: '1rem'}}>
            <Form.Label>Email address</Form.Label>
            <Form.Control type='email' value={username} placeholder="Enter your email" onChange={ev => setUsername(ev.target.value)} onBlur = {(ev) => validateEmail(ev.target.value)} required={true} />
            {error && 
            (<p style={{marginLeft: '0.6rem', marginTop: '0.4rem'}} className="redcolor">{error}</p>)} 
        </Form.Group>

        <Form.Group controlId='password' style={{marginTop: '2.5rem'}}>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} placeholder="Enter your password" onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
        </Form.Group>

        <div align="center">
            <Button className='edit-button' variant="dark" style={{marginTop: '1.5rem', marginBottom: '1.5rem'}} type="submit">Login</Button>
        </div>
      </Form>
  )
};


function LoginRoute(props) {
  return(
    <>
      <Row className="justify-content-center" style={{marginTop: "2rem"}}>
        <Col xs={8} sm={7} md={5} lg={4} xl={4} xxl={4} style={{backgroundColor: 'black', color: 'white', borderTop: "2px solid black", borderLeft: "2px solid black", borderRight: "1px solid black", borderBottom: "1px solid black", position: "relative"}}>
            <CloseButton variant="white" onClick={() => {props.setShowLoginForm(false)}} style={{position: "absolute", marginTop: '0.8rem', right: "1rem"}}/>
            <h1 align="center" style={{marginBottom: "1.5rem", marginTop: "1rem"}}>Login</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col xs={8} sm={7} md={5} lg={4} xl={4} xxl={4} style={{borderBottom: "1px solid black", borderLeft: "2px solid black", borderRight: "1px solid black"}}>
            <LoginForm login={props.login} />
            {props.message && 
            <Alert variant={props.message.type} onClose={() => props.setMessage('')} dismissible style={{fontSize: "0.9rem"}}>{props.message.msg}</Alert>}
        </Col>
      </Row>
    </>
  );
}


function LogoutButton(props) {
  return(
    <Row>
      <Col>
            <Button type="button" variant="outline-dark" onClick={props.logout} className="btn btn-lg fixed-right-top edit-button">Logout</Button>
      </Col>
    </Row>
  )
}

export { LoginForm, LoginRoute, LogoutButton };