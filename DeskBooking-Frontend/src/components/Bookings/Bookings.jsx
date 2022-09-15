import React from "react";
import { Layout, Button, Tabs } from "antd";
const { Header, Footer, Content } = Layout;
import { PlusOutlined } from "@ant-design/icons";
import AllBookings from "./AllBookings/AllBookings";

import "./Bookings.css";
import "antd/dist/antd.css";

function Bookings() {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <>
      <Header className="header">
        <h1 className="header-text">Bookings</h1>
        <Button
          className="add-bookings-button"
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          // size={"small"}
        >
          CREATE BOOKING
        </Button>
      </Header>
      <Content>
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          type="card"
          items={[
            {
              label: `ALL BOOKINGS`,
              key: "1",
              children: <AllBookings />,
            },
            {
              label: `MY BOOKINGS`,
              key: "2",
              children: `Content of Tab Pane 2`,
            },
          ]}
        />
      </Content>
      {/* <Footer>Footer</Footer> */}
    </>
  );
}

export default Bookings;

// ALL BOOKINGS, MY BOOKINGS

//  booking ID -> REF
// Date
// User
// Room ID
// Desk ID
// Start Time
// End Time
//
