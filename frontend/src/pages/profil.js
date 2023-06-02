import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { getData, postData } from "../utils/network";

const OrdersTable = () => {
    const [orders, setOrders] = useState(null);

    const getOrdersList = async () => {
        const { success, orders: ordersList } = await getData("/orders/my-orders");
        if (!success) {
            return alert("Error");
        }

        return setOrders(ordersList);
    };

    const recordsTableHead = [
        "#",
        "Товары",
        "Количество",
        "Общая стоимость",
        "Статус оплаты",
    ];

    const checkout = async (order) => {
        try {
            const { confirmation, paid } = await postData("/invoices/create", order)
            if (!paid) {
                window.open(confirmation.confirmation_url, "_self")
            }

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getOrdersList()
    }, [])

    return (
        <Container>
            {!orders || orders.length === 0 ? <h1 className="d-flex justify-content-center">Заказов пока нет</h1> :
                <Table
                    responsive="sm"
                    bordered
                    striped
                    title="Мои заказы"
                    style={{ backgroundColor: "white", borderRadius: 5 }}
                >
                    <thead>
                        <tr align="center">
                            <th colSpan={12}>Мои заказы</th>
                        </tr>
                        <tr>
                            {recordsTableHead.map((item, index) => (
                                <th key={index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={order.id}>
                                <td align="center">{index + 1}</td>
                                <td>
                                    {!Array.isArray(order.product_name) ? order.product_name
                                        : order.product_name.map((product_name, index) =>
                                            <p key={index}>
                                                {product_name}
                                            </p>
                                        )}
                                </td>
                                <td>
                                    {!Array.isArray(order.amount) ? order.amount : order.amount.map((amount, index) =>
                                        <p key={index}>
                                            {amount}
                                        </p>
                                    )}
                                </td>
                                <td>
                                    {new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(order.total_price)}
                                </td>
                                <td align="center">
                                    {order.status === "succeeded" ? "Оплачен" :
                                     <>
                                        Не оплачен
                                        <br />
                                        <Button onClick={() => checkout(order)}>
                                            Оплатить
                                        </Button>
                                    </>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>}
        </Container>
    )
}

const UserForm = ({ currentName, currentEmail }) => {
    const [newName, setNewName] = useState(currentName);
    const [newEmail, setNewEmail] = useState(currentEmail);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const editUserData = (e) => {
        e.preventDefault();
        postData("/users/profile/edit", { name: newName, email: newEmail, password: newPassword })
            .then(response => {
                if (!response.success) {
                    alert(response.message);
                    if (response.code !== "NETWORK_ERROR")
                        return;
                }
                return alert("Данные успешно изменены")
            })
    };

    return (
        <Container className="my-5">
            <Col
                className="mx-auto"
                md={6}
                sm={12}
            >
                <Card className="w-100">
                    <Card.Body>
                        <Card.Title className="text-center text-uppercase" style={{ fontFamily: "Century Gothic", letterSpacing: "3.5px", fontSize: "30px" }}>
                            Изменить ваши данные
                        </Card.Title>

                        <Form onSubmit={editUserData}>
                            <Form.Group className="reg-fg">
                                <Form.Label>Имя</Form.Label>

                                <Form.Control
                                    type="name"
                                    placeholder="Введите имя"
                                    id="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="reg-fg">
                                <Form.Label>Адрес электронной почты</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Введите email"
                                    id="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="reg-fg">
                                <Form.Label>Текущий пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Введите пароль"
                                    id="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="reg-fg">
                                <Form.Label>Новый Пароль</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите новый пароль"
                                    id="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Button
                                className="d-block mt-3"
                                type='submit'
                                disabled={currentPassword === '' || newPassword === ''}
                                style={{ width: "300px", margin: "0 auto", borderColor: "black", color: "black" }}
                            >
                                Изменить
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
}

const Profil = () => {
    const [user, setUser] = useState();

    const getUserData = async () => {
        const { user } = await getData('/users/one')

        setUser(user)
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <Container>
            <h1 className="pt-3" style={{ color: 'rgba(0,0,0,.55)' }}>Профиль</h1>
            {user &&
                <>
                    <h3>Имя:</h3> <p>{user.name}</p>
                    <h3>Email:</h3> <p>{user.email}</p>
                </>
            }

            <OrdersTable />

            {!user ? null : <UserForm currentName={user.name} currentEmail={user.email} />}
        </Container>
    );
}
export default Profil
