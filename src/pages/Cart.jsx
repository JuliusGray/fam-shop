import React from "react";
import "../styles/cart.css";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { motion } from "framer-motion";
import { cartActions } from "../redux/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const canProceedToCheckout = cartItems.length > 0;

  const notify = () => {
    toast.error(
      "Перейти к оформлению заказа невозможно, так как в корзине нет товаров!"
    );
  };

  return (
    <Helmet title="Корзина">
      <CommonSection title="Корзина" />
      <section>
        <Container>
          <Row>
            <Col lg="9">
              {cartItems.length === 0 ? (
                <h2 className="fs-4 text-center">Товаров нет в корзине</h2>
              ) : (
                <table className="table bordered">
                  <thead>
                    <tr>
                      <th className="text-center">Изображение</th>
                      <th className="text-center">Название</th>
                      <th className="text-center">Цена</th>
                      <th className="text-center">Количество</th>
                      <th className="text-center">Удалить</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, index) => (
                      <Tr item={item} key={index} />
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
            <Col lg="3">
              <div>
                <h6 className="d-flex align-items-center justify-content-between ">
                  Итого:<span className="fs-4 fw-bold">{totalAmount}₽</span>
                </h6>
              </div>
              <div>
                {canProceedToCheckout ? (
                  <Link to="/checkout">
                    <button className="buy__btn w-100">Оформить заказ</button>
                  </Link>
                ) : (
                  <button className="buy__btn w-100" onClick={notify}>
                    Оформить заказ
                  </button>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = ({ item }) => {
  const dispatch = useDispatch();

  const deleteProduct = () => {
    dispatch(cartActions.deleteItem(item.id));
  };

  const addToCard = () => {
    dispatch(
      cartActions.addItem({
        id: item.id,
        productName: item.productName,
        price: item.price,
        imgUrl: item.imgUrl,
      })
    );
  };

  const delProduct = () => {
    dispatch(cartActions.delItem(item.id));
  };

  return (
    <tr>
      <td className="img__product">
        <img src={item.imgUrl} alt="" className="img__product" />
      </td>
      <td className="centered-cell">{item.productName}</td>
      <td className="centered-cell text-center">{item.price}₽</td>
      <td className="centered-cell text-center">
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={delProduct}
          class="ri-subtract-line"
        ></motion.i>
        {item.quantity}px
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={addToCard}
          class="ri-add-line"
        ></motion.i>
      </td>
      <td className="centered-cell text-center">
        <motion.i
          whileTap={{ scale: 1.2 }}
          onClick={deleteProduct}
          class="ri-delete-bin-line"
          style={{ fontSize: "25px" }}
        ></motion.i>
      </td>
    </tr>
  );
};

export default Cart;
