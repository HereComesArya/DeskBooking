import React, { useState } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import "./NavBar.css";
import logo from "./../../../assets/images/teknorix-logo.svg";

const NavBar = ({ menu }) => {
  const [visible, setVisible] = useState(false);
  return (
    <nav className="navbar">
      <Drawer
        title="Menu"
        placement="left"
        // setVisible(false)
        onClick={() => console.log(`ahsbS`)}
        onClose={() => setVisible(false)}
        open={visible}
      >
        {menu}
      </Drawer>
      <a href="/">
        <img src={logo} className="logo" alt="logo" />
      </a>
      <Button
        className="menu"
        type="primary"
        icon={<MenuOutlined />}
        onClick={() => setVisible(true)}
      />
    </nav>
  );
};

export default NavBar;
