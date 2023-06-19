import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import { auth, db } from "../firebase.config";
import { doc, updateDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [user, setUser] = useState(null);
  const { data: ordersData, loading } = useGetData("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const deleteProd = async (id) => {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: "Отменен" });
    toast.success("Заказ отменен!");
  };

  const showProductTable = (order) => {
    if (showProducts && selectedOrder && selectedOrder.id === order.id) {
      return (
        <tr key={`${order.id}-products`}>
          <td colSpan="7">
            <table className="table">
              <thead>
                <tr>
                  {/* <th>Изображение товара</th> */}
                  <th>Название товара</th>
                  <th className="text-center">Количество</th>
                  <th className="text-center">Цена(за шт)</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems.map((product) => (
                  <tr key={product.id}>
                    {/* <td>
                      <img src={product.imgUrl} />
                    </td> */}
                    <td>{product.productName}</td>
                    <td className="text-center">{product.qty}</td>
                    <td className="text-center">{product.price}₽</td>
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
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th className="text-center">ФИО покупателя</th>
                  <th className="text-center">Адрес доставки</th>
                  <th className="text-center">Номер телефона</th>
                  <th className="text-center">Стоимость заказа</th>
                  <th className="text-center">Время доставки</th>
                  <th className="text-center">Статус доставки</th>
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
                    .sort((a, b) => b.date - a.date)
                    .filter((item) => item.user_uid === user.uid)
                    .map((item) => (
                      <>
                        <tr key={item.id}>
                          <td className="text-center">{item.FirstName}</td>
                          <td>{item.address}</td>
                          <td className="text-center">{item.phoneNumber}</td>
                          <td className="text-center">{item.price}₽</td>
                          <td className="text-center">{item.deliveryTime}</td>
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
                          <td className="text-center">
                            <button
                              onClick={() => {
                                deleteProd(item.id);
                              }}
                              className="btn btn-danger"
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

export default MyOrders;
