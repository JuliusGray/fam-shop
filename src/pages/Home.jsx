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
import { useRef } from "react";

const Home = () => {
  const { data: products, loading } = useGetData("products");
  const [newProducts, setNewProducts] = useState([]);
  const [bestProducts, setBestProducts] = useState([]);
  const scrolNewProductslRef = useRef(null);
  const scrolBestProductsRef = useRef(null);

  useEffect(() => {
    const filterNewProducts = products
      .filter((item) => item.dateUpload <= Date.now())
      .slice(0, 10);

    setNewProducts(filterNewProducts);

    const filterBestProducts = products
      .filter((item) => item.rating === "4.9" || item.rating === "4.8")
      .slice(0, 10);
    setBestProducts(filterBestProducts);
  }, [products]);

  const handleScroll = (scrollOffset, componentRef) => {
    componentRef.current.scrollLeft += scrollOffset;
  };

  return (
    <Helmet title={"Главная"}>
      <section className="hero__section">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content">
                <h2>Семейный - ваш путь к вкусной и здоровой жизни!</h2>
                <p>
                  Добро пожаловать в магазин "Семейный" — ваш идеальный партнер
                  в сфере питания и бытовых товаров для всей семьи! Наш магазин
                  предлагает широкий ассортимент высококачественных продуктов
                  питания, свежих овощей и фруктов, молочных продуктов, мяса,
                  рыбы, замороженных товаров, а также товаров для кухни, гигиены
                  и уборки, которые помогут сделать вашу жизнь более комфортной
                  и приятной.
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
      <Services />
      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Новинки</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading....</h5>
            ) : (
              <div className="trending__products-container">
                <button
                  className="scroll-button left"
                  onClick={() => handleScroll(-1000, scrolNewProductslRef)}
                >
                  &lt; {/* Left arrow */}
                </button>
                <div className="trending__products" ref={scrolNewProductslRef}>
                  <ProductList data={newProducts} />
                </div>
                <button
                  className="scroll-button right"
                  onClick={() => handleScroll(1000, scrolNewProductslRef)}
                >
                  &gt; {/* Right arrow */}
                </button>
              </div>
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
      <section className="best__sales">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Выбор покупателя</h2>
            </Col>
            {loading ? (
              <h5 className="fw-bold">Loading....</h5>
            ) : (
              <div className="trending__products-container">
                <button
                  className="scroll-button left"
                  onClick={() => handleScroll(-1000, scrolBestProductsRef)}
                >
                  &lt; {/* Left arrow */}
                </button>
                <div className="trending__products" ref={scrolBestProductsRef}>
                  <ProductList data={bestProducts} />
                </div>
                <button
                  className="scroll-button right"
                  onClick={() => handleScroll(1000, scrolBestProductsRef)}
                >
                  &gt; {/* Right arrow */}
                </button>
              </div>
            )}
          </Row>
        </Container>
      </section>
      {/* <section className="new__arrivals">
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="section__title">Новые поступления</h2>
              <p className="section__subtitle">Нет поступлений</p>
            </Col>
          </Row>
        </Container>
      </section> */}
    </Helmet>
  );
};

export default Home;
