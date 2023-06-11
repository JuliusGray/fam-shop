import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/CommonSection";
import useGetData from "../custom-hooks/useGetData";
import { auth } from "../firebase.config";
import { collection, addDoc, getDocs, where } from "firebase/firestore";
import { db } from "../firebase.config";
import { cartActions } from "../redux/slices/cartSlice";

import "../styles/checkout.css";

import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const totalQty = useSelector((state) => state.cart.totalQuantity);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const discount = useSelector((state) => state.cart.discount);
  const shippingCost = useSelector((state) => state.cart.shippingCost);
  const totalOrderAmount = useSelector((state) => state.cart.totalOrderAmount);
  const { data: usersData, loading } = useGetData("users");
  const user = auth.currentUser;
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const dispatch = useDispatch();

  const checkUserDataInDatabase = async (userId) => {
    try {
      const querySnapshot = await getDocs(
        collection(db, "users"),
        where("uid", "==", userId),
        where("phoneNumber", "!=", "-"),
        where("FirstName", "!=", "-"),
        where("address", "!=", "-")
      );
      if (!querySnapshot.empty) {
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push(doc.data());
        });
        const currentUserData = userData.find((data) => data.uid === userId);
        if (currentUserData) {
          if (currentUserData.phoneNumber !== "-") {
            setPhoneNumber(currentUserData.phoneNumber);
          }
          if (currentUserData.FirstName !== "-") {
            setFirstName(currentUserData.FirstName);
          }
          if (currentUserData.address !== "-") {
            setAddress(currentUserData.address);
          }
        }
      }
    } catch (error) {
      console.log("Error checking user data in database: ", error);
    }
  };
  const userId = user ? user.uid : null;
  checkUserDataInDatabase(userId);

  useEffect(() => {
    if (user) {
      checkUserDataInDatabase(user.uid);
    }
  }, [user]);

  const orderItems = cartItems.map((item) => ({
    id: item.id,
    productName: item.productName,
    price: item.price,
    imgUrl: item.imgUrl,
    qty: item.quantity,
  }));

  const setOrder = async (e) => {
    e.preventDefault();
    try {
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, {
        user_uid: user.uid,
        phoneNumber: phoneNumber,
        FirstName: firstName,
        address: address,
        price: totalAmount,
        date: `${Date.now()}`,
        status: "В обработке",
        orderItems: orderItems,
      });
      toast.success("Заказ успешно оформлен!");
      console.log("Order added successfully!");
      dispatch(cartActions.clearCart());
    } catch (error) {
      console.log("Error adding order: ", error);
      toast.error("Что-то пошло не так!");
    }
  };

  return (
    <Helmet title="Заказ">
      <CommonSection title="Формирование заказа" />
      <section>
        <Container>
          <Row>
            <Col lg="8">
              <h6 className="mb-4 fw-bold">Адресная информация</h6>
              {loading ? (
                <h5 className="fw-bold">Loading....</h5>
              ) : (
                usersData?.map((item) => {
                  if (item.id === user.uid) {
                    return (
                      <Form
                        key={item.id}
                        className="billing__form"
                        onSubmit={setOrder}
                      >
                        <FormGroup className="form__group">
                          {item.FirstName === "-" ? (
                            <input
                              type="text"
                              placeholder="Введите ваше имя"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              readOnly
                              className="block-input"
                              title="Изменить Имя можно в личном кабинете"
                            />
                          )}
                        </FormGroup>
                        <FormGroup className="form__group">
                          {item.phoneNumber === "-" ? (
                            <input
                              type="number"
                              placeholder="Введите номер телефона"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              readOnly
                              className="block-input"
                              title="Изменить Номер телефона можно в личном кабинете"
                            />
                          )}
                        </FormGroup>
                        <FormGroup className="form__group">
                          {item.address === "-" ? (
                            <input
                              type="text"
                              placeholder="Введите адрес"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                            />
                          ) : (
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              readOnly
                              className="block-input"
                              title="Изменить Адрес можно в личном кабинете"
                            />
                          )}
                        </FormGroup>
                      </Form>
                    );
                  }
                  return null;
                })
              )}
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
                    Скидка: 
                  </span>
                  <span>{discount}%</span>
                </h6>
                <h6>
                  <span>
                    Доставка: 
                  </span>
                  <span>{shippingCost}₽</span>
                </h6>
                <h4>
                  Итого: <span>{totalOrderAmount}₽</span>
                </h4>
                <h6>
                  <span>Оплата товара при получении</span>
                </h6>
                <button
                  className="buy_btn w-100"
                  type="submit"
                  onClick={setOrder}
                >
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
