import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.config.js";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(false);
      }
    });

    return () => unsubscribe();

  }, []);

  return { currentUser };
};

export default useAuth;
