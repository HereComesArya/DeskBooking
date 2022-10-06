import { React, useContext, useEffect, useState } from "react";
import { Link, Route, useLocation } from "wouter";
import { getUserInfo } from "../utils/getUserInfo";
import { UserContext } from "../App";
const useCheckAuth = () => {
  // const [user,setUser] = useState(null)
  const { user, setUser } = useContext(UserContext);
  //console.log(user);
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (user) {
      return;
    }

    getUserInfo().then((data) => {
      if (data) {
        setUser(data);
        return;
      }

      setUser(false);
      setLocation("/login");
      return;
    });
  }, []);

  return user;
};
const AuthGuard = ({ children }) => {
  const user = useCheckAuth();
  //console.log("user: ",user);
  if (user == null) {
    return <div>Loading...</div>;
  }
  if (user === false) {
    return <></>;
  }
  // console.log(user)
  return children;
};

export default AuthGuard;
