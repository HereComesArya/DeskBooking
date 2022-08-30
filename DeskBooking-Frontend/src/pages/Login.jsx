import { Card, Button, Tooltip } from "antd";
import React from "react";
import "antd/dist/antd.css";
import "../styles/Login.css";

import Background from "../assets/images/floor-background.webp";
import TeknorixLogo from "../assets/images/teknorix-logo.svg";
import GoogleLogo from "../assets/images/icons8-google.svg";
import MicrosoftLogo from "../assets/images/icons8-microsoft.svg";

const Login = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        width: "100vw",
        height: "100vh",
        // minWidth: "100%",
        // minHeight: "100%",
        overflow: "hidden",
        backgroundColor: "#aed3eb",
        backgroundBlendMode: "multiply",
        // display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          // flexDirection: "row",
          // alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Card className="card">
          <img className="teknorix-logo" src={TeknorixLogo}></img>
          <p className="login-text">Log in to DeskBooker</p>

          <Button className="Login-button" block href="/api/signin-google?returnUrl=/home">
            <span style={{ marginRight: 10 }}>
              <img src={GoogleLogo}></img>
            </span>
            <span>Continue with Google</span>
          </Button>

          <Button className="Login-button" block href="/api/signin-ms?returnUrl=/">
            <span style={{ marginRight: 10 }}>
              <img src={MicrosoftLogo}></img>
            </span>
            <span>Continue with Microsoft</span>
          </Button>
        </Card>

        {/* <div
          className="slogan"
          style={{
            marginTop: "10%",
            marginRight: "10%",
            width: "200px",
          }}
        > */}
        <h1 className="slogan" style={{ color: "white" }}>
          BOOK YOUR DESK NOW
        </h1>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Login;
