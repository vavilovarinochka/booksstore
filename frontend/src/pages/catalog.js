import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import AdminAddProductsdModal from "../components/AdminAddProductModal";
import AdminEditProductsdModal from "../components/AdminEditProductModal";
import { cartContext } from '../templates/page';
import { getData, postData } from "../utils/network";


const ProductCard = ({ product, isAdmin, getProductList, handleAdd, deleteProduct }) => {
    const [editModalShow, setEditModalShow] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(false)

    function getPhoto() {
        getData(`/photos/one/${product.photo_id}`).then(({ success, photo }) => {
            if (success) return setPhotoUrl(`http://localhost:8080/uploads/${photo.photo_path}`)
        })
    }

    useEffect(() => {
        getPhoto()
    }, [])
    return (
        <Card style={{ width: '18rem' }}>
            {photoUrl &&
                <Card.Img
                    className="d-block m-auto"
                    style={{ width: '90%' }}
                    src={photoUrl} />
            }
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                    Автор: {product.author}
                </Card.Text>
                <Card.Text>
                    Цена: {product.price}₽
                </Card.Text>
                <Card.Text>
                    Осталось {product.amount} книг
                </Card.Text>

                {isAdmin ?
                    (<>
                        <AdminEditProductsdModal
                            show={editModalShow}
                            productData={product}
                            getProductList={getProductList}
                            onHide={() => setEditModalShow(false)}
                        />
                        <Container>
                            <Button
                                className="mx-3"
                                onClick={() => setEditModalShow(true)}
                                style={{ width: '180px' }}
                            >Изменить</Button>
                            <Button
                                className="mx-3"
                                onClick={() => deleteProduct(product.id)}
                                style={{ width: '180px' }}
                            >Удалить</Button>
                        </Container>
                    </>
                    )
                    :
                    (<Button
                        className="w-100"
                        onClick={() => handleAdd(product.id)}
                    >Купить</Button>
                    )

                }
            </Card.Body>
        </Card>



    )
}

const Buy = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);
    const [productList, setProductList] = useState(false)
    const { cartList, setCartList } = useContext(cartContext);

    const getUserData = async () => {
        const { user } = await getData('/users/one')
        if (user.role === "admin") return setIsAdmin(true)
    }

    async function getProductList() {
        const { success, products, message } = await getData('/products/list')
        if (!success) return alert(message);
        return setProductList(products)
    }

    function handleAdd(itemId) {
        const candidate = cartList.findIndex(item => item.id === itemId)
        if (candidate >= 0) {
            const updatedCart = [...cartList]
            updatedCart[candidate].amount += 1
            setCartList(updatedCart)
        }
        else {
            setCartList(prev => [...prev, { id: itemId, amount: 1 }])
        }
    }

    async function deleteProduct(productId) {
        const { success, message } = await postData("/products/del", { productId });
        if (!success) return alert(message)
        await getProductList()
        return alert(message)
    }

    useEffect(() => {
        getProductList()
        getUserData()
    }, [])
    return (
        <Container>
            <h1
                className="pt-3"
                style={{ color: 'rgba(0,0,0,.55)' }}
            >
                Каталог
            </h1>

            {isAdmin &&
                <>
                    <AdminAddProductsdModal
                        show={addModalShow}
                        getProductList={getProductList}
                        onHide={() => setAddModalShow(false)}
                    />
                    <Button
                        variant="primary"
                        onClick={() => setAddModalShow(true)}
                    >
                        Добавить товар
                    </Button>
                </>
            }
            <Container className="w-80">
                <Row>
                    {productList && productList.length > 0 ?
                        productList.map((product) => <Col>
                            <ProductCard
                                key={product.id}
                                product={product}
                                isAdmin={isAdmin}
                                getProductList={getProductList}
                                handleAdd={handleAdd}
                                deleteProduct={deleteProduct}
                            />
                        </Col>
                        )
                        :
                        <h3>Сейчас товаров нет, приходите позже :)</h3>
                    }
                </Row>
            </Container>
        </Container>
    )
}
export default Buy
