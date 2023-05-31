import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import { Container, Row, Col, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.config";
import { toast } from "react-toastify";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";

import "../styles/login.css";

import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [FirstName, setFirstName] = useState("");
  const [SurName, setSurName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = UserCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        phoneNumber: "",
        FirstName: FirstName,
        SurName: SurName,
        email,
      });

      setLoading(false);
      toast.success(
        "Успешная регистрация! Добро пожаловать в наш продуктовый магазин. Теперь вы можете войти в свою учетную запись и начать покупки."
      );
      navigate("/login");
      console.log(user);
    } catch (error) {
      setLoading(false);
      toast.error("Что-то пошло не так!");
    }
  };

  return (
    <Helmet title="Login">
      <section>
        <Container>
          <Row>
            {loading ? (
              <Col lg="12" className="text-center">
                <h5 className="fw-bold">Loading....</h5>
              </Col>
            ) : (
              <Col lg="6" className="m-auto text-center ">
                <h3 className="fw-bold mb-4 ">Sign Up</h3>
                <Form className="auth__form" onSubmit={signup}>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Фамилия"
                      value={SurName}
                      onChange={(e) => setSurName(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="text"
                      placeholder="Имя"
                      value={FirstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="email"
                      placeholder="Введите Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup className="form__group">
                    <input
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <button type="submit" className="buy__btn auth__btn">
                    Зарегистрироваться
                  </button>
                  <button className="buy__btn auth__btn">
                    <Link to="/ph-signup">
                      Зарегистрироваться по номеру телефона
                    </Link>
                  </button>
                  <p>
                    Уже есть аккаунт? <Link to="/login">Авторизоваться</Link>
                  </p>
                </Form>
              </Col>
            )}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Signup;
