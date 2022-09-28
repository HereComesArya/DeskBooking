import React, { useContext } from "react";
import { Route, useLocation } from "wouter";

import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  PoweroffOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
  PlusCircleFilled,
  PlusOutlined,
  EditOutlined,
  BuildOutlined,
} from "@ant-design/icons";

import NavBar from "../../components/responsive-sidebar/NavBar/NavBar";
import SideBar from "../../components/responsive-sidebar/SideBar/SideBar";
import Bookings from "../../components/Bookings/Bookings";
import AddSpaces from "../../components/Spaces/AddSpaces/AddSpaces";

import "./MainApp.css";
import "antd/dist/antd.css";
import { signOut } from "../../utils/signOut";
import { UserContext } from "../../App";

function MainApp() {
  const [, setLocation] = useLocation();
  const { user, setUser } = useContext(UserContext);
  const SideMenu = (
    <Menu
      defaultSelectedKeys={["/"]}
      mode={"inline"}
      onClick={({ key }) => {
        if (key === "/signout") {
          signOut().then(() => {
            setUser(false);
            setLocation("/login");
          });
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
        user.isAdmin && {
          label: "Manage Spaces",
          icon: <BuildOutlined />,
          children: [
            {
              label: "Add Space",
              key: "/add-space",
              icon: <PlusOutlined />,
            },
            {
              label: "Modify Space",
              key: "/modify-space",
              icon: <EditOutlined />,
            },
          ],
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
          <Route path="/bookings" component={Bookings}></Route>
          {user.isAdmin && (
            <Route path="/add-space" component={AddSpaces}></Route>
          )}
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
