import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase.config.js";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.role === "Admin") {
            setIsAdmin(true);
            // navigate("/dashboard/all-products")
          } else {
            setIsAdmin(false);
          }
          
        }
      } else {
        setCurrentUser(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { currentUser, isAdmin };
};

export default useAuth;
