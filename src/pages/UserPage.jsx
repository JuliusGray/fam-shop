import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { auth } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";
import "../styles/userPage.css";
import Helmet from "../components/Helmet/Helmet";

const UserPage = () => {
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  const [edit, setEdit] = useState(false);
  const [FirstName, setFirstName] = useState("");
  const [SurName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [address, setAddress] = useState("");

  const editTrue = () => {
    setEdit(true);
  };

  const editFalse = () => {
    setEdit(false);
  };

  return (
    <Helmet title={"Профиль"}>
      <Container>
        <Row>
          <Col>
            <h1 class="article__title">Профиль</h1>
          </Col>
          <Col>
            <a class="article__title-action" onClick={editTrue}>
              Редактировать
            </a>
          </Col>
        </Row>
        <Row>
          <h2 class="user-profile-section__header">Общая информация</h2>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading....</h5>
              </Col>
            ) : (
              usersData?.map((item) => {
                if (item.id === user.uid) {
                  return (
                    <Form key={item.id}>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          {" "}
                          Полное имя:
                        </label>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="text"
                              placeholder="Введите Фамилию"
                              value={SurName}
                              onChange={(e) => setSurName(e.target.value)}
                            />
                          ) : (
                            item.SurName
                          )}
                        </div>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="text"
                              placeholder="Введите Имя"
                              value={FirstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          ) : (
                            item.FirstName
                          )}
                        </div>
                      </FormGroup>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Пол:
                        </label>
                        <div className="user-profile-field__value">-</div>
                      </FormGroup>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Дата рождения:
                        </label>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="date"
                              value={selectedData}
                              onChange={(e) => setSelectedData(e.target.value)}
                            />
                          ) : (
                            item.FirstName
                          )}
                        </div>
                      </FormGroup>
                    </Form>
                  );
                }
                return null;
              })
            )}
          </Col>
        </Row>
        <Row>
          <h2 class="user-profile-section__header">Контактная информация</h2>
        </Row>
        <Row>
          <Col>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading....</h5>
              </Col>
            ) : (
              usersData?.map((item) => {
                if (item.id === user.uid) {
                  return (
                    <Form key={item.id}>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Телефон:
                        </label>
                        <div className="user-profile-field__value">
                          {item.phoneNumber}
                        </div>
                        <div className="data__tooltip">
                          <i
                            className="ri-question-line"
                            data-tooltip="Для смены номера телефона свяжитесь с тех. поддержкой"
                          ></i>
                        </div>
                      </FormGroup>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Email:
                        </label>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="email"
                              placeholder="Введите Email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          ) : (
                            item.email
                          )}
                        </div>
                      </FormGroup>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Домашний адрес:
                        </label>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="text"
                              placeholder="Город, улица, дом, квартира"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="custom-input"
                            />
                          ) : (
                            item.email
                          )}
                        </div>
                      </FormGroup>
                    </Form>
                  );
                }
                return null;
              })
            )}
          </Col>
        </Row>
      </Container>
    </Helmet>
  );
};

export default UserPage;
