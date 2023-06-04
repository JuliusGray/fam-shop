import React from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { auth } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";
import "../styles/userPage.css";

const UserPage = () => {
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  return (
    <Container>
      <Row>
        <Col>
          <h1 class="article__title">Профиль</h1>
        </Col>
        <Col>
          <a class="article__title-action" href="">
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
            <h5 className="py-5 text-center fw-bold">Loading.....</h5>
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
                        {item.SurName} {item.FirstName}
                      </div>
                    </FormGroup>
                    <FormGroup className="user-profile-field user-profile-field--custom">
                      <label className="user-profile-field__label">Пол:</label>
                      <div className="user-profile-field__value">-</div>
                    </FormGroup>
                    <FormGroup className="user-profile-field user-profile-field--custom">
                      <label className="user-profile-field__label">
                        Дата рождения:
                      </label>
                      <div className="user-profile-field__value">-</div>
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
            <h5 className="py-5 text-center fw-bold">Loading.....</h5>
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
                      <div className="data__tooltip" >
                        <i className="ri-question-line" data-tooltip="Для смены номера телефона свяжитесь с тех. поддержкой"></i>
                      </div>
                    </FormGroup>
                    <FormGroup className="user-profile-field user-profile-field--custom">
                      <label className="user-profile-field__label">
                        Email:
                      </label>
                      <div className="user-profile-field__value">
                        {item.email}
                      </div>
                    </FormGroup>
                    <FormGroup className="user-profile-field user-profile-field--custom">
                      <label className="user-profile-field__label">
                        Домашний адрес:
                      </label>
                      <div className="user-profile-field__value">-</div>
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
  );
};

export default UserPage;
