import {Link} from "react-router-dom";
import "./styles/Error.css"

function Error(){
    return(
        <div className="error-container">
            <h1 className="error-title">Ops!</h1>
            <p className="error-message">Что-то пошло не так!</p>
            <Link to="/" className="error-link">
                <button className="error-button">Login</button>
            </Link>
        </div>
    );
}

export default Error;