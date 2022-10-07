import React, { useState, useEffect, useContext, useRef } from "react";
import moment from "moment";
import {
  Layout,
  Button,
  Tabs,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Select,
  Radio,
} from "antd";
const { RangePicker } = DatePicker;
import { getFormattedSpaceData } from "../../../utils/services";
import ImagePanZoomAddBookings from "../ImagePanZoomBookings/ImagePanZoomAddBookings";
import { BookingsConfigContext } from "../../../helpers/contexts/AddBookingsLayoutConfig";
import RoomImage from "../../../assets/images/empty-grid.jpg";

const BookingsModal = ({ bookingId, open, onCreate, onCancel }) => {
  const [form] = Form.useForm();

  //get spacenames and store in data source
  const [children, setChildren] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await getFormattedSpaceData().then((data) => {
        //set children
        const result = [];
        data.map((item, index) => {
          result.push(
            <Select.Option key={item.spaceId}>{item.spaceName}</Select.Option>
          );
        });
        setChildren(result);
        // console.log(data);
      });
    };
    getData();
  }, []);

  // useEffect(() => {}, [dataSource]);

  /* Use Context */
  /*Image inside viewer*/
  const [image, setImage] = useState(RoomImage);
  /*Name of the selected space*/
  const [spaceName, setSpaceName] = useState("");
  //Space selected by user
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  //List of desks(id, name, x, y)
  const [deskList, setDeskList] = useState([]);
  //Desk Slected by user
  const [selectedDeskId, setSelectedDeskId] = useState("");
  //
  const [initialDeskNumber, setInitialDeskNumber] = useState(1);

  const values = {
    image,
    setImage,
    spaceName,
    setSpaceName,
    selectedSpaceId,
    setSelectedSpaceId,
    deskList,
    setDeskList,
    selectedDeskId,
    setSelectedDeskId,
    initialDeskNumber,
    setInitialDeskNumber,
  };

  const form_spacename = Form.useWatch("spacename", form);
  const form_date = Form.useWatch("date", form);
  const form_time = Form.useWatch("time", form);
  useEffect(() => {
    // trigger state updates
    if ((form_spacename, form_time, form_date))
      console.log(form_spacename, form_time, form_date);
  }, [form_spacename, form_time, form_date]);

  return (
    <Modal
      style={{ display: "flex" }}
      open={open}
      title={bookingId ? "Edit Booking" : "Add Booking"}
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      destroyOnClose={true}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form
        preserve={false}
        form={form}
        // layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: "public",
        }}
      >
        <>
          <Form.Item
            name="spacename"
            label="Choose Space"
            //   onValuesChange={validateSpace}
          >
            <Select
              placeholder="Select space"
              showSearch
              style={{
                width: 200,
              }}
              optionFilterProp="children"
              filterOption={(input, option) => option.children.includes(input)}
              filterSort={(optionA, optionB) =>
                optionA.children
                  .toLowerCase()
                  .localeCompare(optionB.children.toLowerCase())
              }
            >
              {children}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Choose Date">
            <RangePicker
              format="DD-MM-YYYY"
              disabled={bookingId ? [true, false] : [false, false]}
              disabledDate={(currentDate) => {
                // Can not select days before today and today
                return currentDate < moment().startOf("day");
              }}
            />
          </Form.Item>

          {/* <Form.Item name="start date" label="Start Date">
            <DatePicker
              className="date-range-picker"
              style={{
                width: "100%",
              }}
            />
          </Form.Item>

          <Form.Item name="end date" label="End Date">
            <DatePicker
              className="date-range-picker"
              style={{
                width: "100%",
              }}
            />
          </Form.Item> */}

          <Form.Item
            name="time"
            label="Choose Time"
            // labelWarp={true}
            // labelAlign={"left"}
          >
            <TimePicker.RangePicker
              format="h:mm:ss A"
              use12Hours
              minuteStep={30}
            />
          </Form.Item>

          <Form.Item name="deskId" label="Choose Desk">
            <Input disabled style={{ maxWidth: 100 }}></Input>
          </Form.Item>
        </>
        <>
          <BookingsConfigContext.Provider value={values}>
            {/* <ImagePanZoomAddBookings></ImagePanZoomAddBookings> */}
          </BookingsConfigContext.Provider>
        </>
      </Form>
    </Modal>
  );
};

export default BookingsModal;
