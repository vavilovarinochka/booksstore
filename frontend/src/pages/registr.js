import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router";
import useRegistrGuard from "../hooks/useRegistrGuard";
import { postData } from "../utils/network";

const Registr = () => {
    useRegistrGuard({ loggedIn: true, path: "/" });
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onRegistr = async (e) => {
        try {
            e.preventDefault()
            const response = await postData("/users/signup", { name, email, password });
            if (!response.success) {
                alert(response.message);
                if (response.code !== "NETWORK_ERROR") {
                    setPassword("");
                }

                return;
            }

            alert("Успешная регистрация")

            localStorage.setItem("token", response.token);
            navigate("/");
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Container>
            <Row>
                <Col md={15} sm={0}>
                    <Card style={{ marginTop: 50 }}>
                        <Card.Body>
                            <Card.Title style={{ fontFamily: "Century Gothic", letterSpacing: "3.5px", textAlign: "center", fontSize: "30px" }}>
                                РЕГИСТРАЦИЯ
                            </Card.Title>
                            <Form onSubmit={onRegistr}>
                                <Form.Group className="reg-fg">
                                    <Form.Label>Имя</Form.Label>
                                    <Form.Control
                                        type="name"
                                        placeholder="Введите имя"
                                        id="name"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="reg-fg">
                                    <Form.Label>Адрес электронной почты</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Введите email"
                                        id="email"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="reg-fg mb-5">
                                    <Form.Label>Пароль</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Введите пароль"
                                        id="password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                    />
                                </Form.Group>

                                <Button
                                    className="w-100"
                                    style={{ borderColor: "black", color: "black" }}
                                    type='submit'
                                >
                                    Зарегистироваться
                                </Button>
                            </Form>
                        </Card.Body>

                    </Card>
                </Col>
                <Col md={3} sm={0} />
            </Row>
        </Container>
    );
}
export default Registr
