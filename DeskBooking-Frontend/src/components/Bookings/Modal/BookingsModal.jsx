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
import getSpaceAndDeskData, {
  getAvailSpaceAndDeskData,
  getAvailableDesks,
  getFormattedSpaceData,
} from "../../../utils/services";
import ImagePanZoomAddBookings from "../ImagePanZoomBookings/ImagePanZoomAddBookings";
import { BookingsConfigContext } from "../../../helpers/contexts/AddBookingsLayoutConfig";
import RoomImage from "../../../assets/images/empty-grid.jpg";
import axios from "axios";

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

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [updateViewer, setUpdateViewer] = useState(false);

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
    updateViewer,
    setUpdateViewer,
  };

  const form_spacename = Form.useWatch("spacename", form);
  const form_date = Form.useWatch("date", form);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    const asyncEffect = async () => {
      if (ready) {
        const getData = async () => {
          await getAvailSpaceAndDeskData({
            id: form_spacename,
            start: startDate.replaceAll(":", "%3A").replaceAll("+", "%2B"),
            end: endDate.replaceAll(":", "%3A").replaceAll("+", "%2B"),
          }).then((data) => {
            // setIsLoading(false);
            // setDataSource(data);
            console.log(data);
            //setid
            setSpaceName(data.name);
            setInitialDeskNumber(data.startingDesk);
            setDeskList(data.desksMain);
            if (!data.defaultImage) {
              setImage(data.image);
            }
            setInitialDeskNumber(data.startingDesk);
            // setOriginalImage(data.image);
            // setIsDefaultImage(false);
            // }
            // setIsFetched(true);
          });
        };
        await getData();
        setUpdateViewer(true);

        // getAvailSpaceAndDeskData(form_spacename);
      }
    };
    asyncEffect();
  }, [ready]);
  useEffect(() => {
    // trigger state updates
    if ((form_spacename, form_date)) {
      if (form_spacename && form_date) {
        console.log(
          form_spacename,
          form_date[0].format(),
          form_date[1].format()
        );
        // get desklist
        console.log("set");
        //set states
        setSelectedSpaceId(form_spacename);
        setStartDate(form_date[0].format());
        setEndDate(form_date[1].format());
        // setStartTime(form_starttime.format());
        // setEndTime(form_endtime.format());
        setReady((prev) => !prev);
      } else {
        setSelectedSpaceId("");
        setStartDate("");
        setEndDate("");
        setReady((prev) => !prev);

        setUpdateViewer(false);
      }
    }
  }, [form_spacename, form_date]);

  function resetStates() {
    setSelectedSpaceId("");
    setStartDate("");
    setEndDate("");
  }
  const formItemLayout = {
    // labelCol: { span: 10 },
    // labelCol: {
    //   xs: {
    //     span: 0,
    //   },
    //   sm: {
    //     span: 0,
    //   },
    // },
    // wrapperCol: { span: 17 },
    // wrapperCol: {
    // xs: {
    //   span: 0,
    // },
    //   sm: {
    //     span: 0,
    //   },
    // },
  };

  return (
    <Modal
      style={{ display: "flex", top: 20 }}
      open={open}
      title={bookingId ? "Edit Booking" : "Add Booking"}
      okText="Create"
      cancelText="Cancel"
      onCancel={() => {
        onCancel();
        resetStates;
      }}
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
        labelAlign="right"
        initialValues={{
          modifier: "public",
        }}
        {...formItemLayout}
      >
        <>
          <Form.Item
            // labelCol={{ span: 5 }}
            name="spacename"
            label="Space"
            rules={[
              {
                required: true,
                message: "Please select a space!",
              },
            ]}
            //   onValuesChange={validateSpace}
          >
            <Select
              placeholder="Select space"
              showSearch
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

          <Form.Item
            name="date"
            label="DateTime"
            rules={[
              {
                required: true,
                message: "Please enter a range!",
              },
              {
                message: "This range is not available!",
                validator: async (_, value) => {
                  value = value ?? "";
                  console.log(value[0].format().slice(0, -6).replace("T", " "));
                  console.log(value[1].format().slice(0, -6).replace("T", " "));
                  console.log(
                    `/api/Booking/userbookingsconflict?start=${value[0]
                      .format()
                      .slice(0, -6)
                      .replace("T", "%20")
                      .replaceAll(":", "%3A")
                      .replaceAll("+", "%2B")}&end=${value[1]
                      .format()
                      .slice(0, -6)
                      .replace("T", "%20")
                      .replaceAll(":", "%3A")
                      .replaceAll("+", "%2B")}`
                  );
                  if (value !== "") {
                    const res = await axios
                      .get(
                        `/api/Booking/userbookingsconflict?start=${value[0]
                          .format()
                          .slice(0, -6)
                          .replace("T", "%20")
                          .replaceAll(":", "%3A")
                          .replaceAll("+", "%2B")}&end=${value[1]
                          .format()
                          .slice(0, -6)
                          .replace("T", "%20")
                          .replaceAll(":", "%3A")
                          .replaceAll("+", "%2B")}`
                      )
                      .catch((e) => console.log(e));
                    //* validation
                    // console.log(res.data);
                    if (res.data == false) {
                      console.log("accept");
                      return Promise.resolve();
                    } else {
                      console.log("reject");
                      Promise.reject();
                    }
                    console.log(res);
                  }
                },
              },
            ]}
          >
            {/* <RangePicker
              format="Do MMM"
              disabled={bookingId ? [true, false] : [false, false]}
              disabledDate={(currentDate) => {
                // Can not select days before today and today
                return currentDate < moment().startOf("day");
              }}
            /> */}
            <RangePicker
              minuteStep={30}
              disabledDate={(currentDate) => {
                // Can not select days before today and today
                return currentDate < moment().startOf("day");
              }}
              // disabledTime={disabledRangeTime}
              showTime={{
                hideDisabledOptions: true,
                defaultValue: [
                  moment("00:00", "HH:mm"),
                  moment("00:00", "HH:mm"),
                ],
              }}
              format="h:mm A D-MM-YY"
            />
          </Form.Item>
          {/*
          // ! old remove 
          // <Form.Item name="start date" label="Start Date">
          //   <DatePicker
          //     className="date-range-picker"
          //     style={{
          //       width: "100%",
          //     }}
          //   />
          // </Form.Item>

          // <Form.Item name="end date" label="End Date">
          //   <DatePicker
          //     className="date-range-picker"
          //     style={{
          //       width: "100%",
          //     }}
          //   />
          // </Form.Item> 

          //! New remove
          <Form.Item
            name="start-time"
            label="Start Time"
            rules={[
              {
                required: true,
                message: "Please select a start time!",
              },
            ]}
            // labelWarp={true}
            // labelAlign={"left"}
          >
            <TimePicker
              // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              format="h:mm:ss A"
              use12Hours
              showNow={false}
              minuteStep={30}
            />
          </Form.Item>

          <Form.Item
            name="end-time"
            label="End Time"
            rules={[
              {
                required: true,
                message: "Please select a start time!",
              },
            ]}

            // labelWarp={true}
            // labelAlign={"left"}
          >
            <TimePicker
              // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              format="h:mm:ss A"
              showNow={false}
              use12Hours
              minuteStep={30}
            />
          </Form.Item> 
          <Form.Item
            name="start-datetime"
            label="Start DateTime"
            rules={[
              {
                required: true,
                message: "Please select a start time!",
              },
            ]}
          >
            <TimePicker
              // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              format="h:mm:ss A"
              showNow={false}
              use12Hours
              minuteStep={30}
            />
          </Form.Item>
          <Form.Item
            name="end-datetime"
            label="End DateTime"
            rules={[
              {
                required: true,
                message: "Please select a start time!",
              },
            ]}
          >
            <TimePicker
              // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              format="h:mm:ss A"
              showNow={false}
              use12Hours
              minuteStep={30}
            />
          </Form.Item>
          <Form.Item
            name="deskId"
            label="Your Desk"
            rules={[
              {
                required: true,
                message: "Please select a desk!",
              },
            ]}
          >
            <Input disabled style={{ maxWidth: 100 }}></Input>
          </Form.Item>
          */}
        </>
        <>
          <BookingsConfigContext.Provider value={values}>
            <ImagePanZoomAddBookings></ImagePanZoomAddBookings>
          </BookingsConfigContext.Provider>
        </>
      </Form>
    </Modal>
  );
};

export default BookingsModal;
