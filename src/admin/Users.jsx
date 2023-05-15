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
                  <tr>
                    <td colSpan="4" className="text-center">
                      <h3 className="py-5 text-center fw-bold">Loading.....</h3>
                    </td>
                  </tr>
                ) : (
                  usersData.map((user) => {
                    <tr key={user.id}>
                      <td>{user.SurName}</td>
                      <td>{user.FirstName}</td>
                      <td>{user.email}</td>
                      <td>
                        <button
                          onClick={() => {
                            deleteUser(user.id);
                          }}
                          className="btn btn-danger"
                        >
                          Удалить
                        </button>
                      </td>
                    </tr>;
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
