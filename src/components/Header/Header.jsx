import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/eco-logo.png";
import { Container, Row, Col, Form } from "reactstrap";
import { useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";
import { motion } from "framer-motion";

const nav__link = [
  {
    path: "home",
    display: "Главная",
  },
  {
    path: "shop",
    display: "Магазин",
  },
  {
    path: "cart",
    display: "Корзина",
  },
];

const Header = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  const [currentUser, setCurrentUser] = useState(false);
  const profileActionRef = useRef(null);

  useEffect(() => {
    if (user) {
      setCurrentUser(true);
    }
  }, [user]);

  const navigateToCart = () => {
    navigate("/cart");
  };
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  const menuRef = useRef(null);

  const stickyHeaderFunc = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("stycky__header");
      } else {
        headerRef.current.classList.remove("stycky__header");
      }
    });
  };

  const logout = () => {
    if (!user) {
      console.log("User is not authenticated");
      return;
    }

    signOut(auth)
      .then(() => {
        toast.success("Вы вышли из аккаунта");
        navigate("/home");
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  useEffect(() => {
    stickyHeaderFunc();

    return () => window.removeEventListener("scroll", stickyHeaderFunc);
  });

  const menuToggle = () => menuRef.current.classList.toggle("active__menu");

  const toggleProfileActions = () => {
    profileActionRef.current.classList.toggle("show__profileActions");
    console.log("Сработало");
  };

  return (
    <>
      <header className="header" ref={headerRef}>
        <Container>
          <Row>
            <div className="nav__wrapper">
              <Link to={"/home"}>
                <div className="logo">
                  <img src={logo} alt="logo" />
                  <div>
                    <h1>Семейный</h1>
                  </div>
                </div>
              </Link>
              <div className="navigation" ref={menuRef} onClick={menuToggle}>
                <ul className="menu">
                  {nav__link.map((item, index) => (
                    <li className="nav__item" key={index}>
                      <NavLink
                        to={item.path}
                        className={(navClass) =>
                          navClass.isActive ? "nav__active" : ""
                        }
                      >
                        {item.display}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="nav__icons">
                <div className="btn profile">
                  {usersData ? (
                    currentUser ? (
                      usersData.map((item) => {
                        if (item.id === user.uid) {
                          return (
                            <Form key={item.id}>
                              <p onClick={toggleProfileActions}>
                                {item.FirstName}
                              </p>
                              {item.role === "User" && (
                                <div
                                  className="profile__actions"
                                  ref={profileActionRef}
                                  onClick={toggleProfileActions}
                                >
                                  <Link to="/profile">Профиль</Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/my-orders">Мои заказы</Link>
                                  <hr className="profile__actions-line" />
                                  <span onClick={logout}>Выйти</span>
                                </div>
                              )}
                              {item.role === "Admin" && (
                                <div
                                  className="profile__actions"
                                  ref={profileActionRef}
                                  onClick={toggleProfileActions}
                                >
                                  <Link to="/profile">Профиль</Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/my-orders">Мои заказы</Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/dashboard/all-orders">
                                    Все заказы
                                  </Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/dashboard/all-products">
                                    Все товары
                                  </Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/dashboard/add-product">
                                    Добавить товар
                                  </Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/dashboard/users">
                                    Пользователи
                                  </Link>
                                  <hr className="profile__actions-line" />
                                  <Link to="/dashboard">Статистика</Link>
                                  <hr className="profile__actions-line" />
                                  <span onClick={logout}>Выйти</span>
                                </div>
                              )}
                            </Form>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <button className="btnLogin-popup">
                        <Link to="/login">Войти</Link>
                      </button>
                    )
                  ) : (
                    <Col lg="12" className="text-center">
                      <h5 className="fw-bold">Loading....</h5>
                    </Col>
                  )}
                </div>{" "}
                <span className="cart__icon" onClick={navigateToCart}>
                  <i className="ri-shopping-bag-line"></i>
                  <span className="badge">{totalQuantity}</span>
                </span>
                <div className="mobile__menu">
                  <span onClick={menuToggle}>
                    <i className="ri-menu-line"></i>
                  </span>
                </div>
              </div>
            </div>
          </Row>
        </Container>
      </header>
    </>
  );
};

export default Header;
