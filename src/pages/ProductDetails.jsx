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
  // const reviewUser = useRef("");
  // const reviewMsg = useRef("");
  const dispatch = useDispatch();

  // const [rating, setRating] = useState(null);
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
    // avgRating,
    // reviews,
    desc,
    shortDesc,
    category,
  } = product;

  const relatedProducts = products.filter((item) => item.category === category);

  // const submitHandler = (e) => {
  //   e.preventDefault();

  //   const reviewUserName = reviewUser.current.value;
  //   const reviewUserMsg = reviewMsg.current.value;

  //   const reviewobj = {
  //     userName: reviewUserName,
  //     text: reviewUserMsg,
  //     rating,
  //   };

  //   toast.success("Отзыв отправлен!");
  // };

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
                  <p>{/* (<span>{avgRating}</span> рейтинг) */}</p>
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
                <h6
                  className={`${tab === "rev" ? "active__tab" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  {/* Отзывы ({reviews.length}) */}
                </h6>
              </div>
              {tab === "desc" ? (
                <div className="tab__content mt-5">
                  <p>{desc}</p>
                </div>
              ) : (
                <div className="product__review mt-5">
                  <div className="review__wrap">
                    <ul>
                      {/* {reviews?.map((item, index) => (
                        <li key={index} className="mb-4">
                          <h6>Имя пользователя</h6>
                          <span>{item.rating} (рейтинг)</span>
                          <p>{item.text}</p>
                        </li>
                      ))} */}
                    </ul>
                    {/* <div className="review__form">
                      <h4>Оставьте свой отзыв</h4>
                      <form action="" onSubmit={submitHandler}>
                        <div className="form__group">
                          <input
                            type="text"
                            placeholder="Enter name"
                            ref={reviewUser}
                            required
                          />
                        </div>
                        <div className="form__group d-flex align-items-center gap-5 rating__group">
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(1)}
                          >
                            1 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(2)}
                          >
                            2 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(3)}
                          >
                            3 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(4)}
                          >
                            4 <i className="ri-star-s-fill"></i>
                          </motion.span>
                          <motion.span
                            whileTap={{ scale: 1.2 }}
                            onClick={() => setRating(5)}
                          >
                            5 <i className="ri-star-s-fill"></i>
                          </motion.span>
                        </div>
                        <div className="form__group">
                          <textarea
                            ref={reviewMsg}
                            rows={4}
                            type="text"
                            placeholder="Отзыв..."
                            required
                          />
                        </div>
                        <motion.button
                          whileTap={{ scale: 1.2 }}
                          type="submit"
                          className="buy__btn"
                        >
                          Отправить
                        </motion.button>
                      </form>
                    </div> */}
                  </div>
                </div>
              )}
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
