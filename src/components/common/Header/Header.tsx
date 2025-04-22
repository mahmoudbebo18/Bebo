import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { authLogout } from '../../../store/auth/authSlice';
import { NavLink } from 'react-router-dom';
import { Badge, Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import classes from './style.module.css';
import HeaderLeftBar from './HeaderLeftBar/HeaderLeftBar';
import { getWishlistItems } from '../../../store/wishlist/wishlistSlice';
import { clearCart, fetchCartItems } from '../../../store/cart/cartSlice';
export const Header = () => {
    const dispatch = useAppDispatch();
    const { accessToken, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (accessToken) {
            dispatch(getWishlistItems("productIds")) // here I assign the type of the param as  productIds to make it go and get the itemsIds array
            dispatch(fetchCartItems()) // fetch the cart items when the component mounts
        } else {
            dispatch(clearCart()) // clear the cart when the user logs out
        }
    }, [dispatch, accessToken])

    return (
        <header>
            <div className={classes.headerContainer}>
                <h1 className={classes.headerLogo}>
                    <span>Our </span>
                    <Badge bg="info"> eCom </Badge>
                </h1>
                <HeaderLeftBar />
            </div>
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark" bg="dark">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">React-Bootstrap</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
                            <Nav.Link as={NavLink} to="/categories">Categories</Nav.Link>
                            <Nav.Link as={NavLink} to="/about">About Us</Nav.Link>
                        </Nav>
                        <Nav>
                            {!accessToken ?
                                <>
                                    <Nav.Link as={NavLink} to="/login">Login </Nav.Link>
                                    <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
                                </>
                                :
                                <NavDropdown title={`${user?.firstName} ${user?.lastName}`} id="basic-nav-dropdown">
                                    <NavDropdown.Item as={NavLink} to="/profile"> Profile </NavDropdown.Item>
                                    <NavDropdown.Item as={NavLink} to="/orders"> Orders </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={() => dispatch(authLogout())}
                                        as={NavLink}
                                        to="/login"
                                    >
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}
