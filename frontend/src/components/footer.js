import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import L from "leaflet"
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./footer.css";

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

const Map = () => {
    return (
        <MapContainer center={[56.13655, 40.39658]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[56.13655, 40.39658]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
        </MapContainer>
    )
}

const Footer = () => {
    const { pathname } = useLocation();

    return (
        <Container id="footer" fluid>
            <Row>
                <Col className="footer-element" xs={12} sm={4}>
                    <h3>Книжный магазин</h3>
                    <p>Онлайн-магазин для покупки книг</p>

                    <Map />
                </Col>

                <Col className="footer-element" xs={12} sm={4}>
                    <h3>Страницы магазина</h3>
                    <ul>
                        <li>
                            <Link className={pathname === "/" ? "current" : ""} to="/">
                                Главная
                            </Link>
                        </li>

                        <li>
                            <Link
                                className={pathname === "/catalog" ? "current" : ""}
                                to="/catalog"
                            >
                                Каталог
                            </Link>
                        </li>

                        <li>
                            <Link
                                className={pathname === "/about/privacy" ? "current" : ""}
                                to="/privacy"
                            >
                                Политика конфиденциальности
                            </Link>
                        </li>
                    </ul>
                </Col>

                <Col className="footer-element" xs={12} sm={4}>
                    <h3>Внешние ссылки</h3>
                    <ul>
                        <li>
                            <a target="_blank" rel="nofollow noreferrer" href="https://vk.com">
                                ВК: @books'ы
                            </a>
                        </li>
                        <li>
                            <a href="mailto:issues@gmail.com">Почта: booksy@gmail.com</a>
                        </li>
                    </ul>
                </Col>
            </Row>

            <Row>
                <Col className="footer-element">
                    <div>&copy; Книжный магазин books'ы 2022&#8212;{new Date().getFullYear()}</div>
                </Col>
            </Row>
        </Container>
    );
};

export default Footer;
