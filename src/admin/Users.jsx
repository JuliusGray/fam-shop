import React from "react";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../custom-hooks/useGetData";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Users = () => {
  const { data: usersData, loading } = useGetData("users");

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    toast.success("Пользователь удален!");
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12">
            <h4 className="fw-bold">Пользователи</h4>
          </Col>
          <Col lg="12" className="py-5">
            <table className="table">
              <thead>
                <tr>
                  <th>Фамилия</th>
                  <th>Имя</th>
                  <th>Email</th>
                  <th>Действие</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h5 className="py-5 text-center fw-bold">Loading.....</h5>
                ) : (
                  usersData?.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.surname}</td>
                        <td>{item.firstname}</td>
                        <td>{item.email}</td>
                        <td>
                          <button
                            onClick={() => {
                              deleteUser(item.id);
                            }}
                            className="btn btn-danger"
                          >
                            Удалить
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Users;
