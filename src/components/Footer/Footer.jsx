import React from "react";

import "./footer.css";

import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <Container>
        <Row>
          <Col lg="5" className="md-4" md="6">
            <div className="logo">
              <div>
                <h1 className="text-white">Семейный</h1>
              </div>
            </div>
            <p className="footer__text mt-4">
              Магазин "Семейный" - ваш идеальный партнер для семейных покупок.
              Лучшие продукты и товары для вашего дома. Заботимся о вашем
              комфорте и качестве. Приходите к нам и создавайте незабываемые
              моменты вместе с вашей семьей!
            </p>
          </Col>
          <Col lg="1" md="3" className="md-4"></Col>
          <Col lg="3" md="3" className="md-4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Полезные ссылки</h4>
              <ListGroup>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/shop">Магазин</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/cart">Корзина</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="/">Главная</Link>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0">
                  <Link to="#">Политика приватности</Link>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="3" md="4">
            <div className="footer__quick-links">
              <h4 className="quick__links-title">Контакты</h4>
              <ListGroup className="footer__contact">
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-map-pin-line"></i>
                  </span>
                  <p>
                    ​Уральская, 5а, с. имени 9 Января, Оренбургский район,
                    Оренбургская область, 460532
                  </p>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-phone-line"></i>
                  </span>
                  <p>+79226209490</p>
                </ListGroupItem>
                <ListGroupItem className="ps-0 border-0 d-flex align-items-center gap-2">
                  <span>
                    <i className="ri-mail-line"></i>
                  </span>
                  <p>info@family.ru</p>
                </ListGroupItem>
              </ListGroup>
            </div>
          </Col>
          <Col lg="12">
            <p className="footer__copyright">
              © Copyright {year} developed{" "}
              <a
                href="https://github.com/JuliusGray"
                target="_blank"
                rel="noopener noreferrer"
              >
                JuliusGray
              </a>
              . Все права защищены.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
