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
import Dashboard from "../../components/Dashboard/Dashboard";
import AddSpaces from "../../components/Spaces/AddSpaces/AddSpaces";

import "./MainApp.css";
import "antd/dist/antd.css";
import { signOut } from "../../utils/signOut";
import { UserContext } from "../../App";
import ManageSpaces from "../../components/Spaces/ManageSpaces";
import Profile from "../../components/Profile/Profile";

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
          key: "/manage-spaces",
          icon: <BuildOutlined />,
          // children: [
          //   {
          //     label: "Add Space",
          //     key: "/customize-space",
          //     icon: <PlusOutlined />,
          //   },
          //   {
          //     label: "Modify Space",
          //     key: "/manage-spaces",
          //     icon: <EditOutlined />,
          //   },
          // ],
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
        <SideBar style={{ height: "100%" }} menu={SideMenu} />
        <Layout className="content" style={{ backgroundColor: "white" }}>
          {/* <Routes> */}
          <Route path="/" component={Dashboard}>
            <h1>Dashboard</h1>
          </Route>
          <Route path="/bookings" component={Bookings}></Route>
          {user.isAdmin && (
            <Route path="/manage-spaces" component={ManageSpaces}></Route>
          )}
          {user.isAdmin && (
            <Route path="/customize-space/:id">
              {(params) => <AddSpaces id={params.id} />}
            </Route>
          )}
          {user.isAdmin && (
            <Route path="/customize-space" component={AddSpaces}></Route>
          )}
          <Route path="/profile" component={Profile}></Route>
          <Route path="/signout">
            <h1>Signout</h1>
          </Route>
        </Layout>
      </Layout>
    </div>
  );
}

export default MainApp;
