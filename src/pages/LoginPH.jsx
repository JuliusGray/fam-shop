import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import React, { useState, useEffect, useRef, useMemo } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "../firebase.config";
import Helmet from "../components/Helmet/Helmet";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const CACHE_KEY_PH = "cached_ph";

const LoginPH = (callback) => {
  const memoizedCallback = useMemo(() => callback, []);

  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();

  const recaptchaContainerRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(CACHE_KEY_PH, ph);
  }, [ph]);

  useEffect(() => {
    recaptchaVerifierRef.current = new RecaptchaVerifier(
      recaptchaContainerRef.current,
      {
        size: "invisible",
        callback: (response) => {
          onSignup();
        },
        "expired-callback": () => {},
      },
      auth
    );
  }, []);

  function onCaptchaVerify() {
    console.log("onCaptchaVerify called");
    if (recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current.render();
    }
  }

  async function onSignup() {
    if (loading) {
      return; // Предотвращаем повторный вызов, если уже идет загрузка
    }
    setLoading(true);
    onCaptchaVerify();
    console.log("onSignup called");

    const appVerifier = recaptchaVerifierRef.current;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error && error.code) {
          if (error.code === "auth/too-many-requests") {
            toast.error(
              "Слишком много запросов. Пожалуйста, повторите попытку позже."
            );
          }
          if (error.code === "auth/quota-exceeded") {
            toast.error(
              "Превышен лимит авторизаций в час. Пожалуйста, повторите попытку позже."
            );
          }
        } else {
          toast.error("Произошла ошибка. Пожалуйста, повторите попытку позже.");
        }
      });
  }

  async function onOTPVerify() {
    console.log("onOTPVerify called");
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        const { uid } = res.user;
        const userDoc = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          setLoading(false);
          navigate("/profile");
        } else {
          setLoading(false);
          setShowOTP(false);
          setShowForm(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error && error.code) {
          if (error.code === "auth/too-many-requests") {
            toast.error(
              "Слишком много запросов. Пожалуйста, повторите попытку позже."
            );
          }
          if (error.code === "auth/quota-exceeded") {
            toast.error(
              "Превышен лимит авторизаций в час. Пожалуйста, повторите попытку позже."
            );
          }
          if (error.code === "auth/invalid-verification-code") {
            toast.error(
              "Введен неправильный код. Пожалуйста, повторите попытку."
            );
          }
        } else {
          toast.error("Произошла ошибка. Пожалуйста, повторите попытку позже.");
        }
      });
  }

  async function onFormSubmit(e) {
    console.log("onFormSubmit called");
    e.preventDefault();
    setLoading(true);

    if (!firstName || !lastName || !birthDate) {
      setLoading(false);
      toast.error("Пожалуйста, заполните все поля.");
      return;
    }

    const user = auth.currentUser;
    const { uid, phoneNumber } = user;

    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      if (userDocSnap.data().disabled) {
        setLoading(false);
        toast.error("Ваша учетная запись отключена.");
        return;
      }
    }
    await setDoc(userDocRef, {
      uid: uid,
      phoneNumber: phoneNumber,
      FirstName: firstName,
      SurName: lastName,
      birth: birthDate,
      role: "User",
      address: "-",
      gender: "-",
      email: "-",
    });

    setLoading(false);
    navigate("/profile");
  }

  return (
    <Helmet title="Авторизация">
      <section className="bg-emerald-500 flex items-center justify-center h-screen">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col lg="12" className="d-flex justify-content-center text-center">
              <Toaster toastOptions={{ duration: 4000 }} />
              <div ref={recaptchaContainerRef} id="recaptcha-container"></div>
              <div className="w-80 flex flex-col gap-4 rounded-lg p-4 my-4">
                <h1 className="text-center leading-normal text-black font-medium text-3xl mb-6">
                  {showForm ? "Регистрация" : "Авторизация"}
                </h1>
                {showOTP ? (
                  <>
                    <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                      <BsFillShieldLockFill size={30} />
                    </div>
                    <label
                      htmlFor="otp"
                      className="font-bold text-xl text-black"
                    >
                      Введите код подтверждения
                    </label>
                    <Col className="mx-auto text-center">
                      <OtpInput
                        value={otp}
                        onChange={setOtp}
                        OTPLength={6}
                        otpType="number"
                        disabled={false}
                        autoFocus
                        className="otp-container"
                      ></OtpInput>
                    </Col>
                    <button onClick={onOTPVerify} className="buy__btn">
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                      <span>Отправить код</span>
                    </button>
                  </>
                ) : showForm ? (
                  <>
                    <form
                      onSubmit={onFormSubmit}
                      className="flex flex-col gap-4"
                    >
                      <br />
                      <input
                        type="text"
                        id="firstName"
                        placeholder="Введите имя"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field mx-1"
                      />
                      <input
                        type="text"
                        id="lastName"
                        placeholder="Введите фамилию"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field mx-1"
                      />
                      <input
                        type="date"
                        id="birthDate"
                        placeholder="Дата рождения"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="input-field mx-1"
                      />
                      <br />
                      <button type="submit" className="buy__btn">
                        {loading && (
                          <CgSpinner size={20} className="mt-1 animate-spin" />
                        )}
                        <span>Зарегистрироваться</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                      <BsTelephoneFill size={30} />
                    </div>
                    <label
                      htmlFor=""
                      className="font-bold text-xl text-black text-center"
                    >
                      Подтвердите ваш номер телефона
                    </label>
                    <Col className="d-flex my-3">
                      <PhoneInput
                        country={"ru"}
                        value={ph}
                        onChange={setPh}
                        inputClass="phone__input"
                      />
                    </Col>
                    <button onClick={onSignup} className="buy__btn">
                      {loading && (
                        <CgSpinner size={20} className="mt-1 animate-spin" />
                      )}
                      <span>Получить СМС</span>
                    </button>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default LoginPH;
