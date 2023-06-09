import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { auth, db } from "../firebase.config";
import useGetData from "../custom-hooks/useGetData";
import "../styles/userPage.css";
import Helmet from "../components/Helmet/Helmet";
import { doc, updateDoc } from "firebase/firestore";

const UserPage = () => {
  // const user = auth.currentUser;
  const [user, setUser] = useState(null);
  const { data: usersData, loading } = useGetData("users");
  const [edit, setEdit] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!loading && usersData.length > 0 && user) {
      const currentUserData = usersData.find((item) => item.id === user.uid);
      if (currentUserData) {
        setFirstName(currentUserData.FirstName);
        setSurName(currentUserData.SurName);
        setEmail(currentUserData.email);
        setSelectedDate(currentUserData.birth);
        setAddress(currentUserData.address);
        setGender(currentUserData.gender);
      }
    }
  }, [loading, usersData, user]);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleEditFalse = () => {
    setEdit(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", user.uid), {
        FirstName: firstName,
        SurName: surName,
        email: email,
        birth: selectedDate,
        address: address,
        gender: gender,
      });

      console.log("Data updated successfully");
      setEdit(false);
    } catch (error) {
      console.error("Error updating data: ", error);
    }
  };

  return (
    <Helmet title={"Профиль"}>
      <Container>
        <Row>
          <Col>
            <h1 className="article__title">Профиль</h1>
          </Col>
          <Col>
            {!edit && (
              <a className="article__title-action" onClick={handleEdit}>
                Редактировать
              </a>
            )}
          </Col>
        </Row>
        <Row>
          <h2 className="user-profile-section__header">Общая информация</h2>
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
                    <Form key={item.id} onSubmit={handleSave}>
                      <FormGroup className="user-profile-field user-profile-field--custom">
                        <label className="user-profile-field__label">
                          Полное имя:
                        </label>
                        <div className="user-profile-field__value">
                          {edit ? (
                            <input
                              type="text"
                              placeholder="Введите Фамилию"
                              value={surName}
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
                              value={firstName}
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
                                  value="Мужской"
                                  checked={gender === "Мужской"}
                                  onChange={(e) => setGender(e.target.value)}
                                />
                                Мужской
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  name="gender"
                                  value="Женский"
                                  checked={gender === "Женский"}
                                  onChange={(e) => setGender(e.target.value)}
                                />
                                Женский
                              </label>
                            </>
                          ) : (
                            item.gender
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
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
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
          <h2 className="user-profile-section__header">
            Контактная информация
          </h2>
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
          {edit && (
            <div className="user-profile-section__save">
              <button className="buy__btn" type="submit" onClick={handleSave}>
                Сохранить
              </button>
              <button className="buy__btn" type="submit" onClick={handleEditFalse}>
                Отменить
              </button>
            </div>
          )}
        </Row>
      </Container>
    </Helmet>
  );
};

export default UserPage;
