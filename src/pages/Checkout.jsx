import React from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";

import "../styles/checkout.css";

import { useSelector } from "react-redux";

const Checkout = () => {
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  return (
    <Helmet title="Оплата">
      <CommonSection title="Оплата" />
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <h6 className="mb-4 fw-bold">Платежная информация</h6>
              <Form className="billing__form">
                <FormGroup className="form__group">
                  <input type="text" placeholder="Введите ваше имя" />
                </FormGroup>
                {/* <FormGroup className="form__group">
                  <input type="email" placeholder="Введите ваш email" />
                </FormGroup> */}
                <FormGroup className="form__group">
                  <input type="number" placeholder="Номер телефона" />
                </FormGroup>
                <FormGroup className="form__group">
                  <input type="text" placeholder="Адрес" />
                </FormGroup>
                {/* <FormGroup className="form__group">
                  <input type="text" placeholder="Введите ваше имя" />
                </FormGroup> */}
              </Form>
            </Col>
            <Col lg="4">
              <div className="checkout__cart">
                <h6>
                  Общее количество: <span>{totalQty} шт</span>
                </h6>
                <h6>
                  Стоимость: <span>{totalAmount}₽</span>
                </h6>
                <h6>
                  <span>
                    Доставка: <br />
                    Бесплатная доставка
                  </span>
                  <span>0.00₽</span>
                </h6>
                <h4>
                  Итого: <span>{totalAmount}₽</span>
                </h4>
                <h6>
                  <span>Оплата товара при получении</span>
                </h6>
                {/* <button className="buy__btn auth__btn w-100">
                  Оплата товара при получении
                </button> */}
                <button className="buy__btn auth__btn w-100">
                  Оформить заказ
                </button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Checkout;
