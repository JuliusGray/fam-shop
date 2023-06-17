import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { cartActions } from "../redux/slices/cartSlice";
import { toast } from "react-toastify";

import { db } from "../firebase.config";
import { doc, getDoc } from "firebase/firestore";

import Helmet from "../components/Helmet/Helmet";
import ProductsList from "../components/UI/ProductList";
import useGetData from "../custom-hooks/useGetData";

import "../styles/product-details.css";

const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [tab, setTab] = useState("desc");
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: products } = useGetData("products");
  const docRef = doc(db, "products", id);

  useEffect(() => {
    const getProduct = async () => {
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log("Нет продукта!");
      }
    };
    getProduct();
  }, []);

  const {
    imgUrl,
    productName,
    price,
    rating,
    desc,
    shortDesc,
    category,
  } = product;

  const relatedProducts = products.filter((item) => item.category === category).slice(0, 10);

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        image: imgUrl,
        productName,
        price,
      })
    );

    toast.success("Товар добавлен!");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  return (
    <Helmet title={productName}>
      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="6">
              <div className="product__img">
                <img src={imgUrl} alt="" />
              </div>
            </Col>
            <Col lg="6">
              <div className="product__details">
                <h2>{productName}</h2>
                <div className="product__rating d-flex align-items-center gap-5 mb-3">
                  <div>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-s-fill"></i>
                    </span>
                    <span>
                      <i class="ri-star-half-s-line"></i>
                    </span>
                  </div>
                  <p>(<span>{rating}</span> рейтинг)</p>
                </div>
                <div className="d-flex align-items-center gap-5">
                  <span className="product__price">{price}₽</span>
                  <span>Категория: {category}</span>
                </div>
                <p className="mt-3">{shortDesc}</p>
                <motion.button
                  whileTap={{ scale: 1.2 }}
                  className="buy__btn"
                  onClick={addToCart}
                >
                  Добавить в корзину
                </motion.button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <div className="tab__wrapper d-flex align-items-center gap-5">
                <h6
                  className={`${tab === "desc" ? "active__tab" : ""}`}
                  onClick={() => setTab("desc")}
                >
                  Описание
                </h6>
              </div>
              <div className="tab__content mt-5">
                <p>{desc}</p>
              </div>
            </Col>
            <Col lg="12" className="mt-5">
              <h2 className="related__title">Вам также может понравиться</h2>
            </Col>
            <ProductsList data={relatedProducts} />
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetails;
