
import { Row, Col, Button } from 'react-bootstrap';

function SelectStatus(props) {
    return(
        <>
        <Row className="justify-content-center" style={{marginTop: "4rem"}}>
            <Col xs={10} sm={10} md={10} lg={10} xl={8} xxl={8} style ={{textAlign: "center"}}>
                <h1>Haven't created a study plan yet?</h1>
            </Col>
        </Row>
        <Row className="justify-content-center" style={{marginTop: "0.5rem"}}>
            <Col xs={8} sm={10} md={8} lg={8} xl={4} xxl={3} style ={{textAlign: "center"}}>
                <h2>Start now by deciding your time status!</h2>
                <br></br>
                <Button type="button" variant="dark" className="btn btn-lg" style={{marginRight: "2rem"}} onClick={() => props.setUserTimeStatus("ft")}>Full Time</Button>
                <Button type="button" variant="dark" className="btn btn-lg" style={{marginLeft: "2rem"}} onClick={() => props.setUserTimeStatus("pt")}>Part Time</Button>
            </Col>
        </Row>
        </>
    )
}

export { SelectStatus };