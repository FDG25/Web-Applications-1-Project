import dayjs from 'dayjs';
import { Row } from 'react-bootstrap';

function Footer() {
    return(
        <>  
        <Row className="justify-content-center" style={{marginTop: '4rem'}}>
            <footer>    
                <address>   
                    <a href="mailto:davidegiovanni.freni@studenti.polito.it">Freni Davide Giovanni (s305571).</a> 
                </address>
                <p id="lineaconclusiva">© Copyright {dayjs().year()} - Study Plan.</p>  
            </footer>
            </Row>
        </>
    )
  }

export { Footer };    
    