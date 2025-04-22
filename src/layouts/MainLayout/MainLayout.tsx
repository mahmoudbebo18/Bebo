import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import classes from "./style.module.css";
import { Header } from "../../components/common/Header/Header";

const MainLayout = () => {
    return (
        <Container className={classes.container}>
            <Header />
            <div className={classes.wrapper}>
                <Outlet />
            </div>
        </Container>
    );
};

export default MainLayout;
