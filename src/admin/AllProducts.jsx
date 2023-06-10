import React from "react";
import { Container, Row, Col } from "reactstrap";
import { db } from "../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import useGetData from "../custom-hooks/useGetData";
import { toast } from "react-toastify";

const AllProducts = () => {
  const { data: productsData, loading } = useGetData("products");

  const deleteProd = async (id) => {
    await deleteDoc(doc(db, "products", id));
    toast.success("Товар удален!");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <table className="table">
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Цена</th>
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
                  productsData.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.imgUrl} />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category}</td>
                      <td>{item.price}₽</td>
                      <td >
                        <button
                          onClick={() => {
                            deleteProd(item.id);
                          }}
                          className="btn btn-info mx-1"
                        >
                          Редактировать
                        </button>
                        <button
                          onClick={() => {
                            deleteProd(item.id);
                          }}
                          className="btn btn-danger mx-1"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>
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

export default AllProducts;
