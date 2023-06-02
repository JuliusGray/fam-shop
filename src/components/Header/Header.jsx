import React, { useRef, useEffect, useState } from "react";
import "./header.css";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/images/eco-logo.png";
import { Container, Row, Form } from "reactstrap";
import { useSelector } from "react-redux";
import useAuth from "../../custom-hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useGetData from "../../custom-hooks/useGetData";

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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  // const [isOpen, setIsOpen] = useState(false);
  const user = auth.currentUser;
  const { data: usersData, loading } = useGetData("users");
  // const profileActionsRef = useRef(null);

  // const toggleDropdown = () => {
  //   setIsOpen(!isOpen);
  // };

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
  // const toggleProfileActions = () =>
    // profileActionsRef.current.classList.toggle("show__profileActions");

  return (
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
              <div className="btn">
                {currentUser ? (
                  <div>
                    {/* <button className="btnLogin-popup" onClick={toggleDropdown}> */}
                    {loading ? (
                      <h6>Loading.....</h6>
                    ) : (
                      usersData?.map((item) => {
                        if (item.id === user.uid) {
                          return (
                            <Form key={item.id}>
                              <p className="text-color"><Link to="/profile">{item.FirstName}</Link></p>
                            </Form>
                          );
                        }
                        return null;
                      })
                    )}
                    {/* </button> */}
                  </div>
                ) : (
                  <button className="btnLogin-popup">
                    <Link to="/login">Войти</Link>
                  </button>
                )}
              </div>
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
  );
};

export default Header;
