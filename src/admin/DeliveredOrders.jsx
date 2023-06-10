import React, { useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { db } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const DeliveredOrders = () => {
  const { data: ordersData, loading } = useGetData("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  const cancelOrder = async (id) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: "Отменен", date: `${Date.now()}` });
    toast.success("Заказ отменен!");
  };

  const sendOrder = async (id) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: "В пути", date: `${Date.now()}` });
    toast.success("Заказ отправлен!");
  };

  const delivered = async (id) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: "Доставлен", date: `${Date.now()}` });
    toast.success("Заказ доставлен!");
  };

  const showProductTable = (order) => {
    if (showProducts && selectedOrder && selectedOrder.id === order.id) {
      return (
        <tr key={`${order.id}-products`}>
          <td colSpan="7">
            <table className="table">
              <thead>
                <tr>
                  <th>Название товара</th>
                  <th className="text-center">Количество</th>
                  <th className="text-center">Цена(за шт)</th>
                  {/* Дополнительные поля о товаре */}
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((product) => (
                  <tr key={product.id}>
                    <td>{product.productName}</td>
                    <td className="text-center">{product.qty}</td>
                    <td className="text-center">{product.price}₽</td>
                    {/* Вывод дополнительных полей о товаре */}
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      );
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col>
            <h1 className="article__title">Доставленные заказы</h1>
          </Col>
          <Col>
            <div className="article__title-action">
              <Link to="/dashboard/all-orders">
                <button className="btn btn-success mx-1">Все</button>
              </Link>
              <Link to="/dashboard/cancel-orders">
                <button className="btn btn-danger mx-1">Отмененные</button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">ФИО покупателя</th>
                  <th className="text-center">Адрес доставки</th>
                  <th className="text-center">Номер телефона</th>
                  <th className="text-center">Стоимость заказа</th>
                  <th className="text-center">Статус заказа</th>
                  <th className="text-center">Товары</th>
                  <th className="text-center">Действие</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <h3 className="py-5 text-center fw-bold">Loading.....</h3>
                    </td>
                  </tr>
                ) : (
                  ordersData
                    .sort((a, b) => a.date - b.date)
                    .filter((item) => item.status === "Доставлен")
                    .map((item) => (
                      <>
                        <tr key={item.id}>
                          {/* <td>
                              <img src={item.imgUrl} />
                            </td> */}
                          <td>{item.FirstName}</td>
                          <td>{item.address}</td>
                          <td className="text-center">{item.phoneNumber}</td>
                          <td className="text-center">{item.price}₽</td>
                          <td className="text-center">{item.status}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-success"
                              onClick={() => {
                                setShowProducts(!showProducts);
                                setSelectedOrder(item);
                              }}
                            >
                              {showProducts &&
                              selectedOrder &&
                              selectedOrder.id === item.id
                                ? "Скрыть"
                                : "Показать"}
                            </button>
                          </td>
                          <td className="d-flex justify-content-center">
                            <button
                              onClick={() => {
                                sendOrder(item.id);
                              }}
                              className="btn btn-warning mx-1"
                            >
                              Доставить
                            </button>
                            <button
                              onClick={() => {
                                delivered(item.id);
                              }}
                              className="btn btn-success mx-1"
                            >
                              Доставлен
                            </button>
                            <button
                              onClick={() => {
                                cancelOrder(item.id);
                              }}
                              className="btn btn-danger mx-1"
                            >
                              Отменить
                            </button>
                          </td>
                        </tr>
                        {showProductTable(item)}
                      </>
                    ))
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DeliveredOrders;
