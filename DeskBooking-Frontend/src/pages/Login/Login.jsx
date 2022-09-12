import { Card, Button, Tooltip } from "antd";
import React from "react";
import "antd/dist/antd.css";
import "./Login.css";

import Background from "../../assets/images/floor-background.webp";
import TeknorixLogo from "../../assets/images/teknorix-logo.svg";
import GoogleLogo from "../../assets/images/icons8-google.svg";
import MicrosoftLogo from "../../assets/images/icons8-microsoft.svg";

const Login = () => {
  return (
    <div>
      <div
        className="full-page"
        style={{
          backgroundImage: `url(${Background})`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            zIndex: "2",
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
            <Button className="Login-button" block href="/api/signin-ms?returnUrl=/home">
              <span style={{ marginRight: 10 }}>
                <img src={MicrosoftLogo}></img>
              </span>
              <span>Continue with Microsoft</span>
            </Button>
          </Card>
          <h1 className="slogan" style={{ color: "white" }}>
            FLEXIBILITY AT YOUR FINGERTIPS.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
