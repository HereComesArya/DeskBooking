import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Layout,
  Button,
  Tabs,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
const { Option } = Select;
import axios from "axios";

import { BookingsConfigContext } from "../../helpers/contexts/AddBookingsLayoutConfig";
import RoomImage from "../../assets/images/empty-grid.jpg";

import "antd/dist/antd.css";
import { Children } from "react";

const AddBookings = () => {
  const {
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
  } = useContext(BookingsConfigContext);

  const [post, setPost] = useState([]);

  useEffect(() => {
    //to fetch spaceNameList
    axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
      // axios.get("/api/space/getall").then((res) => {
      setPost(res.data);
    });
  }, []);

  const children = [];
  const [spaceNameList, setSpaceNameList] = useState([
    {
      spaceId: "1",
      name: "Desk 1",
    },
    {
      spaceId: "2",
      name: "Desk 2",
    },
    {
      spaceId: "3",
      name: "Desk 3",
    },
  ]);

  spaceNameList.map((item, index) => {
    children.push(<Option key={item.spaceId}>{item.name}</Option>);
  });

  spaceNameList && {};

  const validateSpace = () => {
    console.log("in validate");
  };

  const onOk = (value) => {
    console.log("onOk: ", moment().format());
    console.log("onOk: ", typeof value);
    console.log("onOk: ", value.format("YYYY-MM-DD HH:mm:ss"));
  };

  return (
    <>
      <div className="main-div">
        <div className="sub-div sub-div-1">
          <Form
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="vertical"
            // initialValues={{
            //   size: componentSize,
            // }}
            // size={componentSize}
            // onValuesChange={onFormLayoutChange}
          >
            <Form.Item
              key="2"
              label="Choose Space"
              //   onValuesChange={validateSpace}
              name="spacename"
            >
              {/* <Select defaultValue="lucy" onChange={handleChange}></Select> */}
              <Select placeholder="Select space">{children}</Select>
            </Form.Item>
            <Form.Item key="3" label="Start Date">
              <DatePicker
                className="date-range-picker"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item key="4" label="End Date">
              <DatePicker
                className="date-range-picker"
                style={{
                  width: "100%",
                }}
              />
            </Form.Item>
            <Form.Item
              key="5"
              label="Start Time"
              // labelWarp={true}
              // labelAlign={"left"}
            >
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={true}
                onOk={onOk}
              />
            </Form.Item>
            <Form.Item key="6" label="End Time">
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                showTime={true}
                onOk={onOk}
              />
            </Form.Item>
          </Form>
        </div>
        {/* <div className="sub-div sub-div-2">anjks</div> */}
      </div>
    </>
  );
};

export default AddBookings;
