import { useState } from 'react';
import { Button, Form, Modal, Row } from 'react-bootstrap';
import { postData, uploadImage } from '../utils/network';


export default function AdminAddProductsdModal(props) {
  const [title, setTitle] = useState();
  const [author, setAuthor] = useState();
  const [amount, setAmount] = useState();
  const [price, setPrice] = useState();
  const [file, setFile] = useState()

  const createProduct = async (event) => {
    event.preventDefault()
    const { success, message, id: photo_id } = await uploadImage(file)
    if (success) {
      const response = await postData("/products/create", { title, author, amount, price, photo_id });

      if (!response.success) {
        alert(response.message);
        if (response.code !== "NETWORK_ERROR");
        return;
      }
      setTitle("")
      setAuthor("")
      setAmount("")
      setPrice("")
      props.getProductList()
      return alert(response.message)
    }
    return alert(message)
  };
  return (
    <Modal
      {...props}
      size="lg"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Добавление товара
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Form onSubmit={createProduct}>
            <Form.Group className="reg-fg">
              <Form.Label>Название книги</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Введите название книги"
                required
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="reg-fg">
              <Form.Label>Автор книги</Form.Label>
              <Form.Control
                size="lg"
                type="text"
                placeholder="Введите автора"
                required
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="reg-fg">
              <Form.Label>Количество книг на складе</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                placeholder="Введите оставшееся количество книг"
                required
                id="amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="reg-fg">
              <Form.Label>Цена книги</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                placeholder="Введите цену"
                required
                id="price"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formFileLg" className="mb-3">
              <Form.Label>Фото книги</Form.Label>
              <Form.Control
                type="file"
                size="lg"
                onChange={(event) => setFile(event.target.files[0])}
              />
            </Form.Group>
            <Button className='ms-auto mt-3' type='submit'>Добавить товар</Button>
          </Form>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Закрыть</Button>
      </Modal.Footer>
    </Modal>
  );
}
