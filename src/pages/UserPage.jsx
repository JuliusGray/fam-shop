import React, { useState } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { auth } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";
import "../styles/userPage.css";
import Helmet from "../components/Helmet/Helmet";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const UserPage = () => {
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  const [edit, setEdit] = useState(false);
  const [FirstName, setFirstName] = useState("");
  const [SurName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedData, setSelectedData] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const editTrue = () => {
    setEdit(true);
  };

  const editFalse = () => {
    setEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", user.uid), {
        FirstName: FirstName,
        SurName: SurName,
      });

      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating data: ", error);
    }
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
                    <Form key={item.id} onSubmit={handleSubmit}>
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
                        <div className="user-profile-field__value">
                          {edit ? (
                            <>
                              <label>
                                <input
                                  type="radio"
                                  name="gender"
                                  value="male"
                                  checked={gender === "male"}
                                  onChange={(e) => setGender(e.target.value)}
                                />
                                Мужской
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="gender"
                                  value="female"
                                  checked={gender === "female"}
                                  onChange={(e) => setGender(e.target.value)}
                                />
                                Женский
                              </label>
                            </>
                          ) : (
                            item.sex
                          )}
                        </div>
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
                            item.birth
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
                            item.address
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
          <Col>
            {edit && (
              <div class="user-profile-section__save">
                {" "}
                <button className="btn__save" type="submit" onClick={editFalse}>
                  {" "}
                  Сохранить
                </button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </Helmet>
  );
};

export default UserPage;
