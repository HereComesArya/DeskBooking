// import { useState } from 'react'
import Login from "./pages/Login/Login";
import { createContext, useState, React } from "react";
import AuthGuard from "./auth/AuthGuard";
import { Redirect, Route, useLocation } from "wouter";
import MainApp from "./pages/MainApp/MainApp";
const UserContext = createContext({ user: null });
function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useLocation();
  return (
    <>
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}
      >
        <AuthGuard>
          <MainApp></MainApp>
        </AuthGuard>
        {/* <Login></Login> */}
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
      </UserContext.Provider>
    </>
  );
}

export default App;
export { UserContext };
