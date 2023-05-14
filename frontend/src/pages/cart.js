import { useContext, useEffect, useState } from 'react';
import { Button, Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import CartListItem from '../components/CartListItem';
import { cartContext } from '../templates/page';
import { getData, postData } from '../utils/network';


export const Cart = () => {
    const [cart, setCart] = useState(null)
    const { cartList, setCartList } = useContext(cartContext);

    async function getCartList() {
        if (cartList.length >= 1) {
            const { success, message, products } = await getData(`/products/havingId?productList=${cartList.map(item => item.id)}`)
            if (!success) return alert(message);
            return setCart(products.map(product => ({ ...product, amount: cartList.find(item => item.id === product.id).amount || 1 })))
        }
        return setCart(false)
    }

    function submitOrder() {
        postData("/orders/create",
            { products: cartList, price: cart.reduce((accumulator, item) => accumulator + item.price * item.amount, 0) }
        ).then(
            res => {
                if (res.success) {
                    alert("Заказ оформлен")
                    return setCartList([])
                }
                return alert("Ошибка")
            }
        )
    }

    function handleSubmit() {
        submitOrder()
    }


    useEffect(() => {
        getCartList()
        console.log(cartList)
    }, [cartList])

    return (
        <Container className='justify-content-center'>
            <Row xs={1} md={2}>
                {cart ?
                    <>
                        <Col xs={12} md={8}>
                            <Card className="w-100 p-2">
                                <h3>Корзина</h3>
                                <ListGroup variant="flush">
                                    {cart.map((item, index) => (
                                        <CartListItem
                                            key={item.id}
                                            index={index}
                                            item={item}
                                        />
                                    ))}
                                </ListGroup>
                                <h3>Итого: {''}
                                    {cart.length >= 1 &&
                                        new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB" }).format(cart.reduce((accumulator, item) => accumulator + item.price * item.amount, 0))
                                    }
                                </h3>
                                <ListGroup variant="flush">
                                    <p>Товары: {' '}
                                        {cart.length >= 1 &&
                                            cart.reduce((accumulator, item) => accumulator + item.amount, 0)
                                        }
                                        {' '}шт.
                                    </p>

                                    <Button
                                        className='m-auto mt-3'
                                        onClick={handleSubmit}
                                        style={{ width: "200px", }}
                                    >
                                        Оформить
                                    </Button>
                                </ListGroup>
                            </Card>
                        </Col>
                    </>
                    :
                    <Col>
                        <h2>Корзина пустует</h2>
                        <p>
                            Загляните в каталог, чтобы выбрать товары
                        </p>
                    </Col>
                }
            </Row>
        </Container>
    )
}
