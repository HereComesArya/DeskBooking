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
  //Desk Slected by user
  const [selectedDeskName, setSelectedDeskName] = useState("");
  //
  const [initialDeskNumber, setInitialDeskNumber] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [updateViewer, setUpdateViewer] = useState(false);

  const [callUseEffect, setCallUseEffect] = useState(false);

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
    selectedDeskName,
    setSelectedDeskName,
  };

  const form_spacename = Form.useWatch("spacename", form);
  const form_date = Form.useWatch("date", form);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    function getDataAndUpdateViewer() {
      const asyncEffect = async () => {
        const getData = async () => {
          await getAvailSpaceAndDeskData({
            id: form_spacename,
            start: startDate
              .format("YYYY-MM-DDTHH:mm:ss")
              .replaceAll(":", "%3A")
              .replaceAll("+", "%2B"),
            end: endDate
              .format("YYYY-MM-DDTHH:mm:ss")
              .replaceAll(":", "%3A")
              .replaceAll("+", "%2B"),
          }).then((data) => {
            // setIsLoading(false);
            // setDataSource(data);
            // console.log(data);
            //setid
            setSpaceName(data.name);
            setInitialDeskNumber(data.startingDesk);
            setDeskList(data.desksMain);
            if (!data.defaultImage) {
              setImage(data.image);
            } else {
              setImage(RoomImage);
            }
            setInitialDeskNumber(data.startingDesk);
          });
        };
        await getData();
        setUpdateViewer((prev) => !prev);

        // getAvailSpaceAndDeskData(form_spacename);
      };

      asyncEffect();
    }
    getDataAndUpdateViewer();
  }, [callUseEffect]);

  function formChanged(errors) {
    console.log("triggered");
    console.log(errors);
    // } else console.log("no erros");

    if ((form_spacename, form_date)) {
      if (form_spacename && form_date) {
        if (errors.length == 0) {
          //* set states
          console.log("internal no erros");
          setSelectedSpaceId(form_spacename);
          setStartDate(form_date[0]);
          setEndDate(form_date[1]);
        }

        console.log(
          form_spacename,
          form_date[0].format(),
          form_date[1].format()
        );
        // get data
        setCallUseEffect((prev) => !prev);
        // getDataAndUpdateViewer();
      }
    } else {
      setSelectedSpaceId("");
      setStartDate("");
      setEndDate("");
      setSelectedDeskId("");
      // setReady((prev) => !prev);
      console.log("reset fields");
    }
  }

  function resetStates() {
    setSelectedSpaceId("");
    setStartDate("");
    setEndDate("");
    setSelectedDeskName("");
    setDeskList([]);
    setImage(RoomImage);
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
  const failCountDown = () => {
    let secondsToGo = 5;
    const modal = Modal.error({
      title: "Booking failed!",
      // content: `This modal will be destroyed after ${secondsToGo} second.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };
  const successCountDown = () => {
    let secondsToGo = 5;
    const modal = Modal.success({
      title: "Booking successful!",
      // content: `This modal will be destroyed after ${secondsToGo} second.`,
    });
    const timer = setInterval(() => {
      secondsToGo -= 1;
    }, 1000);
    setTimeout(() => {
      clearInterval(timer);
      modal.destroy();
    }, secondsToGo * 1000);
  };
  return (
    <>
      <Modal style={{ display: "flex", top: 20 }}></Modal>
      <Modal
        style={{ display: "flex", top: 20 }}
        open={open}
        title={bookingId ? "Edit Booking" : "Add Booking"}
        okText="Create"
        cancelText="Cancel"
        onCancel={() => {
          onCancel();
          resetStates();
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
          let data = {
            startTime: startDate.format("YYYY-MM-DDTHH:mm:ss"),
            endTime: endDate.format("YYYY-MM-DDTHH:mm:ss"),
            spaceId: form_spacename,
            deskId: selectedDeskId,
            isRepeating: false,
            startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"),
            endDate: endDate.format("YYYY-MM-DDTHH:mm:ss"),
          };
          console.log(data);
          axios
            .post(`/api/Booking/add`, data)
            .then((res) => console.log(res))
            .catch((err) => {
              console.log(err);
              failCountDown();
            });
          successCountDown();
          resetStates();
        }}
      >
        <Form
          preserve={false}
          form={form}
          // layout="vertical"
          name="form_in_modal"
          labelAlign="right"
          initialValues={{
            name: "public",
          }}
          onFieldsChange={() => formChanged(form.getFieldError("date"))}
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
                filterOption={(input, option) =>
                  option.children.includes(input)
                }
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
                  message: "End time has to be after start time!",
                  validator: (_, value) => {
                    value = value ?? "";
                    // console.log(moment().hour());
                    // console.log(value[0].hour());
                    // console.log(value[1].hour());
                    // console.log("sm" + value[0].minute());
                    // console.log("em" + value[1].minute());
                    // console.log(value[0].hour() < value[1].hour());
                    if (value !== "") {
                      if (
                        value[0].hour() > value[1].hour() ||
                        (value[0].hour() == value[1].hour() &&
                          value[0].minute() > value[1].minute())
                      ) {
                        // console.log("reject");
                        return Promise.reject();
                      } else {
                        // console.log("accept");
                        return Promise.resolve();
                      }
                    }
                  },
                },
                {
                  message: "This range is not available!",
                  validator: async (_, value) => {
                    value = value ?? "";
                    // console.log(moment().format("YYYY-MM-DDTHH:mm:ss"));
                    // console.log(value[0].toISOString());
                    // console.log(
                    //   `/api/Booking/userbookingsconflict?startDate=${value[0]
                    //     .format("YYYY-MM-DDTHH:mm:ss")
                    //     .replaceAll(":", "%3A")
                    //     .replaceAll("+", "%2B")}&endDate=${value[1]
                    //     .format("YYYY-MM-DDTHH:mm:ss")
                    //     .replaceAll(":", "%3A")
                    //     .replaceAll("+", "%2B")}`
                    // );
                    if (value !== "") {
                      const res = await axios
                        .get(
                          `/api/Booking/userbookingsconflict?startDate=${value[0]
                            .format("YYYY-MM-DDTHH:mm:ss")
                            .replaceAll(":", "%3A")
                            .replaceAll("+", "%2B")}&endDate=${value[1]
                            .format("YYYY-MM-DDTHH:mm:ss")
                            .replaceAll(":", "%3A")
                            .replaceAll("+", "%2B")}`
                        )
                        .catch((e) => console.log(e));
                      //* validation
                      // console.log(res.data);
                      if (res.data == false) {
                        return Promise.resolve();
                      } else {
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
                  return (
                    currentDate < moment().startOf("day") ||
                    currentDate > moment().add(1, "week")
                  );
                }}
                disabledTime={() => {
                  return {
                    disabledHours: () => [
                      1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 0,
                    ],
                  };
                }}
                showTime={{
                  hideDisabledOptions: true,
                  defaultValue: [
                    moment("09:00", "HH:mm"),
                    moment("14:00", "HH:mm"),
                  ],
                }}
                format="h:mm a D-MM-YY"
              />
            </Form.Item>
            <p>Selected Desk: {selectedDeskName}</p>
            {/* <Form.Item
              label="Selected Desk"
              name="selectedDesk"
              rules={[
                {
                  required: true,
                  message: "Please select a seat!",
                },
              ]}
            >
              <Input value={selectedDeskName} />
            </Form.Item> */}
          </>
          <>
            <BookingsConfigContext.Provider value={values}>
              <ImagePanZoomAddBookings></ImagePanZoomAddBookings>
            </BookingsConfigContext.Provider>
          </>
        </Form>
      </Modal>
    </>
  );
};

export default BookingsModal;
