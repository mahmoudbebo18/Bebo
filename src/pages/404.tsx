import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import LottieHandler from "../components/feedback/LottieHandler/LottieHandler";

const Error = () => {

    return (
        <Container>
            <div
                className="d-flex flex-column align-items-center"
                style={{ marginTop: "15%" }}
            >
                <LottieHandler type="notFound" />
                <Link to="/" replace={true}>
                    How about going back to safety?
                </Link>
            </div>
        </Container>
    );
};

export default Error;