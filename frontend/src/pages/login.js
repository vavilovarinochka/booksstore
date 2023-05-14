import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import useLoginGuard from "../hooks/useLoginGuard";
import { postData } from "../utils/network";

const LoginPage = () => {
    useLoginGuard({ loggedIn: true, path: "/" });
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onLogin = async (e) => {
        e.preventDefault()
        const response = await postData("/users/login", { email, password });

        if (!response.success) {
            if (response.code !== "NETWORK_ERROR") setPassword("");
            return;
        }

        localStorage.setItem("token", response.token);
        navigate("/");
    };

    return (
        <Container>
            <Row>
                <Col md={3} sm={0} />
                <Col md={15} sm={0}>
                    <Card style={{ marginTop: 50 }}>
                        <Card.Body>
                            <Card.Title style={{ "fontFamily": "Century Gothic", "letterSpacing": "3.5px", "textAlign": "center", "fontSize": "30px" }}>ВХОД</Card.Title>
                            <Form onSubmit={onLogin}>
                                <Form.Group className="login-fg">
                                    <Form.Label>Адрес электронной почты</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Введите email"
                                        id="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group className="login-fg">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Введите пароль"
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Form.Group> <br />
                                <Button style={{ "width": "300px", "margin": "0 auto", "display": "block", "borderColor": "black", "color": "black" }} type='submit'>Войти</Button> <br />
                            </Form>
                        </Card.Body>

                    </Card>
                </Col>
                <Col md={3} sm={0} />
            </Row>
        </Container>
    );
};

export default LoginPage;
