import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";

import Img from "../assets/images/grocery-cart.png";
import counterImg from "../assets/images/Мандарины-скидка.png";
import Helmet from "../components/Helmet/Helmet";
import ProductList from "../components/UI/ProductList";
import Clock from "../components/UI/Clock";
import Services from "../services/Services";
import "../styles/home.css";

const Home = () => {
  const { data: products, loading } = useGetData("products");
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);

  useEffect(() => {
    const filterNewProducts = products.filter(
      (item) => item.dateUpload <= Date.now()
    );
    setNewProducts(filterNewProducts);

    const filterBestProducts = products.filter(
      (item) => item.rating === "4.9" || item.rating === "4.8"
    );
    setBestProducts(filterBestProducts);
  }, [products]);

  return (
    <Helmet title={"Главная"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h2>Семейный - ваш путь к вкусной и здоровой жизни!</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum
                  optio nisi fugiat praesentium deleniti quas vel id dolor
                  eligendi magnam illum quidem sint ratione facere dolorum
                  nihil, in voluptatibus? Aliquid.
                </p>
                <motion.button whileTap={{ scale: 1.2 }} className="buy__btn">
                  <Link to="/shop">Перейти в магазин</Link>
                </motion.button>
              </div>
            </Col>
            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={Img} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="trending__products">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Новинки</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading....</h5>
            ) : (
              <ProductList data={newProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Выбор покупателя</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading....</h5>
            ) : (
              <ProductList data={bestProducts} />
            )}
          </Row>
        </Container>
      </section>
      <section className="timer__count">
        <Container>
          <Row>
            <Col lg="6" md="12" className="count__down-col">
              <div className="clock__top-content">
                <h4 className="text-white fs-6 mb-2">
                  Ограниченное предложение
                </h4>
                <h3 className="text-white fs-5 mb-3">Мандарины</h3>
              </div>
              <Clock />
              <motion.button
                whileTap={{ scale: 1.2 }}
                className="buy__btn store__btn"
              >
                <Link to="/shop">Перейти в магазин</Link>
              </motion.button>
            </Col>
            <Col lg="6" md="12" className="text-end counter__img">
              <img src={counterImg} alt="" />
            </Col>
          </Row>
        </Container>
      </section>
      <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Новые поступления</h2>
              <p className="section__subtitle">Нет поступлений</p>
            </Col>
          </Row>
        </Container>
      </section>
      <Services />
    </Helmet>
  );
};

export default Home;
