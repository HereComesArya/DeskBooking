import React from "react";
import { Route, useLocation } from "wouter";

import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  PoweroffOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

import NavBar from "../../components/responsive-sidebar/NavBar/NavBar";
import SideBar from "../../components/responsive-sidebar/SideBar/SideBar";
import ViewBookings from "../../components/ViewBookings/ViewBookings";

import "./MainApp.css";
import "antd/dist/antd.css";

function MainApp() {
  const [, setLocation] = useLocation();
  const SideMenu = (
    <Menu
      defaultSelectedKeys={["/"]}
      mode={"inline"}
      onClick={({ key }) => {
        if (key === "signout") {
          //signout
        } else {
          setLocation(key);
        }
      }}
      items={[
        { label: "Dashboard", key: "/", icon: <HomeOutlined /> },
        {
          label: "Bookings",
          key: "/bookings",
          icon: <UnorderedListOutlined />,
        },
        { label: "Profile", key: "/profile", icon: <UserAddOutlined /> },
        {
          label: "Signout",
          key: "/signout",
          icon: <PoweroffOutlined />,
          danger: true,
        },
      ]}
    ></Menu>
  );
  return (
    <div className="MainApp">
      <NavBar menu={SideMenu} />
      <Layout>
        <SideBar menu={SideMenu} />
        <Layout className="content" style={{ backgroundColor: "white" }}>
          {/* <Routes> */}
          <Route path="/">
            <h1>Dashboard</h1>
          </Route>
          <Route path="/bookings" component={ViewBookings}></Route>
          <Route path="/profile">
            <h1>Profile</h1>
          </Route>
          <Route path="/signout">
            <h1>Signout</h1>
          </Route>
          {/* </Routes> */}
        </Layout>
      </Layout>
    </div>
  );
}

export default MainApp;
