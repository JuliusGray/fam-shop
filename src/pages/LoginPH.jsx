import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";

import OtpInput from "otp-input-react";
import { useState, useEffect } from "react";
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
// import { auth } from "../firebase.config";

const CACHE_KEY_OTP = "cached_otp";
const CACHE_KEY_PH = "cached_ph";

const LoginPH = () => {
  const [otp, setOtp] = useState(localStorage.getItem(CACHE_KEY_OTP) || "");
  const [ph, setPh] = useState(localStorage.getItem(CACHE_KEY_PH) || "");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const navigate = useNavigate();

  let recaptchaVerifier = null;

  useEffect(() => {
    localStorage.setItem(CACHE_KEY_OTP, otp);
  }, [otp]);

  useEffect(() => {
    localStorage.setItem(CACHE_KEY_PH, ph);
  }, [ph]);

  function onCaptchVerify() {
    if (!recaptchaVerifier) {
      recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup(e) {
    e.preventDefault();
    setLoading(true);
    onCaptchVerify();

    const appVerifier = recaptchaVerifier;

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
        toast.error("Повторите попытку позже!");
      });
  }

  async function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        const { uid } = res.user;

        const userDoc = doc(db, "users", uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          // Пользователь уже зарегистрирован, выполняем вход в систему без изменений в базе данных
          setLoading(false);
          navigate("/profile");
        } else {
          // Новый пользователь, открываем окно для ввода дополнительных данных
          setLoading(false);
          setShowOTP(false); // Скрываем окно с OTP-кодом
          setShowForm(true); // Отображаем форму для ввода дополнительных данных
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const confirmationResult = window.confirmationResult;
    const credential = await confirmationResult.confirm(otp);
    const user = credential.user;
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

    // Получаем значения полей формы
    const firstNameValue = firstName.trim();
    const lastNameValue = lastName.trim();
    const birthDateValue = birthDate.trim();

    // Выполняем регистрацию пользователя в базе данных
    await setDoc(userDocRef, {
      uid: uid,
      phoneNumber: phoneNumber,
      firstName: firstNameValue,
      lastName: lastNameValue,
      birthDate: birthDateValue,
      role: "User",
      address: "-",
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
              <div id="recaptcha-container"></div>
              <div className="w-80 flex flex-col gap-4 rounded-lg p-4 my-4">
                <h1 className="text-center leading-normal text-black font-medium text-3xl mb-6">
                  Авторизация
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
                    <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                      <BsTelephoneFill size={30} />
                    </div>
                    <form
                      onSubmit={onFormSubmit}
                      className="flex flex-col gap-4"
                    >
                      <label
                        htmlFor="firstName"
                        className="font-bold text-xl text-black"
                      >
                        Имя
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="input-field"
                      />
                      <label
                        htmlFor="lastName"
                        className="font-bold text-xl text-black"
                      >
                        Фамилия
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="input-field"
                      />
                      <label
                        htmlFor="birthDate"
                        className="font-bold text-xl text-black"
                      >
                        Дата рождения
                      </label>
                      <input
                        type="text"
                        id="birthDate"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="input-field"
                      />
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
