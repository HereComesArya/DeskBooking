// import { useState } from 'react'
import Login from "./pages/Login";
import { createContext, useState, React } from "react";
import AuthGuard from "./auth/AuthGuard";
import { Redirect, Route, useLocation } from "wouter";
import MainApp from './pages/MainApp/MainApp';
const UserContext = createContext({ user: null });
function App() {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();  
  return (
    <>
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        {/* <Route path="/">
          <Redirect to="/home"/>
        </Route>
        <Route path="/home"> */}
          <AuthGuard>
            <MainApp></MainApp>
          </AuthGuard> 
          {/* </Route> */}
        <Route path="/login">
          <Login></Login>
        </Route>
      </UserContext.Provider>
    </>
  );
}

export default App;
export { UserContext };
