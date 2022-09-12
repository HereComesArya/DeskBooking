import {React, useContext, useEffect, useState} from 'react';
import { Link, Route, useLocation } from "wouter";
import {getUserInfo} from "../utils/getUserInfo";
import {UserContext} from "../App"
const useCheckAuth = () => {
    // const [user,setUser] = useState(null)
    const { user,setUser} = useContext(UserContext);
    console.log(user);
    const [,setLocation] = useLocation();
    useEffect(() => {
      if (user) {   
        return;
      }
  
      getUserInfo().then((data) => {
        if (data) {
          setUser(data);
          return;
        }
  
        setUser(null);
        setLocation("/login");
        return;
      });
    }, []);
  
    return user;
  };
  const AuthGuard = ({ children }) => {
    const user = useCheckAuth();
  
    if (!user) {
      return <div>Loading...</div>;
    }
  
    return children;
  };

export default AuthGuard;
