import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
// import { Basket2, PersonSquare, DoorOpen } from 'react-bootstrap-icons';
import { Basket2, PersonSquare, BoxArrowRight } from 'react-bootstrap-icons';
import { useLocation, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import useToken from "../hooks/useToken";
import "./header.css";



const Header = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { loggedIn } = useToken();

    const onLogout = () => {
        localStorage.removeItem("token");
        navigate("/")
    }

    return (
        <Navbar
            collapseOnSelect
            expand="lg"
            bg="light"
        >
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        id="logo"
                        src={"/assets/logo.png"}
                        alt='logo'
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                <Navbar.Collapse>
                    <Nav >
                        <Nav.Link as={Link} to="/" disabled={pathname === "/"}>
                            ГЛАВНАЯ
                        </Nav.Link>

                        <Nav.Link as={Link} to="/catalog" disabled={pathname === "/catalog"}>
                            КАТАЛОГ
                        </Nav.Link>

                        <NavDropdown title="О НАС">
                            <NavDropdown.Item as={Link} to="/privacy">
                                Политика конфиденциальности
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ms-auto">
                        {!loggedIn ?
                            (<NavDropdown title="АВТОРИЗАЦИЯ" style={{ "color": "black !important" }}>
                                <NavDropdown.Item href="/avtoriz/login">
                                    ВОЙТИ
                                </NavDropdown.Item>
                                <NavDropdown.Item href="/avtoriz/registr">
                                    ЗАРЕГИСТРИРОВАТЬСЯ
                                </NavDropdown.Item>
                            </NavDropdown>
                            )
                            :
                            (<>
                                <Nav.Link
                                    as={Link}
                                    to='/profil'
                                    disabled={pathname === "/collections"}
                                    style={{ "display": "inline-block" }}
                                >
                                    <PersonSquare size={35} />
                                </Nav.Link>
                                <Nav.Link
                                    as={Link}
                                    to='/cart'
                                    style={{ "display": "inline-block" }}
                                >
                                    <Basket2 size={35} />
                                </Nav.Link>
                                <Nav.Link
                                    onClick={onLogout}
                                    style={{ "display": "inline-block" }}
                                >
                                    <BoxArrowRight size={35} />
                                </Nav.Link>
                            </>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
