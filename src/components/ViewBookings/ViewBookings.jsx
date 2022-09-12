import React from "react";
import { Layout, Button } from "antd";
const { Header, Footer, Content } = Layout;
import { PlusOutlined } from "@ant-design/icons";

import "./view-bookings.css";

function ViewBookings() {
  return (
    <>
      <Header className="header">
        <h1 className="header-text">Bookings</h1>
        <Button
          // type="success"
          // style={{ backgroundColor: "light-green" }}
          shape="round"
          icon={<PlusOutlined />}
          size={"large"}
        >
          CREATE BOOKING
        </Button>
      </Header>
      <Content>Content</Content>
      <Footer>Footer</Footer>
    </>
  );
}

export default ViewBookings;
