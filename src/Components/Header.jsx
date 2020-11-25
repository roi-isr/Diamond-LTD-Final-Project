import React from 'react';
import "./Header.css"
import Logo from '../Assets/logo.jpg'
import Homepage from './Homepage';
import { Form, FormControl, Button, Nav, NavDropdown, Navbar } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const Header = () => {

    return (

        <header>
            <img src={Logo} className="logo" alt="logo image" />

            <NavItem />

        </header>

    )

}

const LoginBtn = () => {
    return
    (
        <Avatar />
    );
}

const NavItem = () => {

    return (

        <Navbar bg="light" expand="lg">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" style={{ justifyContent: "space-between", width: "60%" }}>
                    <Nav.Link href="#login"><AccountCircleIcon className="login-btn" fontSize="medium" color="blue" /></Nav.Link>
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#Shop">Shop</Nav.Link>
                    <Nav.Link href="#About">About</Nav.Link>
                    <Nav.Link href="#FAQ">FAQ</Nav.Link>
                    <Nav.Link href="#Contact">Contact us</Nav.Link>

                </Nav>
                <Form inline>
                    <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                    <Button variant="outline-success">Search</Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>

    )

}



export default Header;