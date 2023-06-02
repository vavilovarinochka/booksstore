import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";


const Main = () => {
    return (
        <>
            <Carousel>
                <Carousel.Item>
                    <img
                        className="d-block m-auto w-100"
                        src={"assets/slider1.png"}
                        alt="First slide"
                    />
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block m-auto w-100"
                        src={"assets/slider2.png"}
                        alt="Second slide"
                    />
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block m-auto w-100"
                        src={"assets/slider3.png"}
                        alt="Second slide"
                    />
                </Carousel.Item>
            </Carousel>

            <Card style={{ marginBottom: "30px", borderColor: "white" }}>
                <Button
                    className="d-block w-100 m-auto"
                    variant="outline-secondary"
                    href="/catalog"
                    style={{ borderColor: "black", color: "black" }}>
                    Купить книги
                </Button>
            </Card >
        </>
    );
};

export default Main
