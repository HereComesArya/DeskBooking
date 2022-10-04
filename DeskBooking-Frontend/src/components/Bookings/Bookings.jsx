import React, { useState, useEffect } from "react";
import {
  Layout,
  Button,
  Tabs,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  TreeSelect,
} from "antd";
const { Header, Footer, Content } = Layout;
import { PlusOutlined } from "@ant-design/icons";
import MyBookings from "./MyBookings/MyBookings";
import AllBookings from "./AllBookings/AllBookings";
import AddBookings from "./AddBookings";
import RoomImage from "../../assets/images/empty-grid.jpg";

import { BookingsConfigContext } from "../../helpers/contexts/AddBookingsLayoutConfig";

import "./Bookings.css";
import "antd/dist/antd.css";

function Bookings() {
  const onChange = (key) => {
    //when tabs are changed
    // console.log(key);
  };

  /*For modal*/
  const [componentSize, setComponentSize] = useState("default");

  const onFormLayoutChange = ({ size }) => {
    setComponentSize(size);
  };
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const format = "HH:mm";

  const validateSpace = (value) => {
    console.log(value);
  };

  /*Name of the selected space*/
  const [spaceName, setSpaceName] = useState("");
  /*Image inside viewer*/
  const [image, setImage] = useState(RoomImage);
  //List of desks(id, name, x, y)
  const [deskList, setDeskList] = useState([]);
  const [selectedDesk, setSelectedDesk] = useState("");
  const [initialDeskNumber, setInitialDeskNumber] = useState(1);

  const values = {
    image,
    setImage,
    spaceName,
    setSpaceName,
    deskList,
    setDeskList,
    selectedDesk,
    setSelectedDesk,
    initialDeskNumber,
    setInitialDeskNumber,
  };
  /*For modal*/

  return (
    <>
      <Header className="header">
        <h1 className="header-text">Bookings</h1>
        <Button
          className="add-bookings-button"
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          onClick={showModal}
          // size={"small"}
        >
          CREATE BOOKING
        </Button>
        <BookingsConfigContext.Provider value={values}>
          <Modal
            // style={{ Width: "420px" }}
            width={1000}
            open={open}
            title="Enter Details..."
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <div className="button">
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={handleOk}
                >
                  Confirm
                </Button>
              </div>,
            ]}
          >
            <AddBookings></AddBookings>
          </Modal>
        </BookingsConfigContext.Provider>
      </Header>
      {/* <BookingsConfigContext.Provider
        value={values}
      ></BookingsConfigContext.Provider> */}

      <Content>
        <Tabs
          defaultActiveKey="1"
          onChange={onChange}
          type="card"
          items={[
            {
              label: `MY BOOKINGS`,
              key: "1",
              children: <MyBookings />,
            },
            {
              label: `ALL BOOKINGS`,
              key: "2",
              children: <AllBookings />,
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
