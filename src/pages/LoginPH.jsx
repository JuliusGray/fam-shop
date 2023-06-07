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
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

const CACHE_KEY_OTP = "cached_otp";
const CACHE_KEY_PH = "cached_ph";

const LoginPH = () => {
  const [otp, setOtp] = useState(localStorage.getItem(CACHE_KEY_OTP) || "");
  const [ph, setPh] = useState(localStorage.getItem(CACHE_KEY_PH) || "");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
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

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        const { uid, phoneNumber } = res.user;

        await setDoc(doc(db, "users", uid), {
          uid: uid,
          phoneNumber: phoneNumber,
          FirstName: "-",
          SurName: "-",
          email: "-",
          role: "User",
          birth: "-",
          sex: "-",
          address: "-",
        });
        setLoading(false);
        navigate("/profile");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
                      Enter your OTP
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
                ) : (
                  <>
                    <div className="bg-white text-emerald-500 w-fit mx-auto p-4 rounded-full">
                      <BsTelephoneFill size={30} />
                    </div>
                    <label
                      htmlFor=""
                      className="font-bold text-xl text-black text-center"
                    >
                      Verify your phone number
                    </label>
                    <Col className="d-flex my-3">
                      <PhoneInput country={"ru"} value={ph} onChange={setPh} inputClass="phone__input" />
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
