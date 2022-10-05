import React, { useContext, useState, useEffect } from "react";
import { LayoutConfigContext } from "../../../helpers/contexts/AdminLayoutConfigContext";
import RoomImage from "../../../assets/images/empty-grid.jpg";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ImagePanZoomFunction from "../../ImagePanZoom/ImagePanZoomFunction";
import { Route, Redirect, useLocation } from "wouter";
import getSpaceAndDeskData from "../../../utils/services";

import axios from "axios";

import {
  Switch,
  Button,
  Input,
  Layout,
  message,
  Upload,
  Form,
  Tooltip,
  InputNumber,
} from "antd";
const { Header } = Layout;

import "./ConfigureLayoutSettings.css";
import "antd/dist/antd.css";

const ConfigureLayoutSettings = (props) => {
  const {
    deskList,
    setDeskList,
    deskId,
    setDeskId,
    image,
    setImage,
    initialDeskNumber,
    setInitialDeskNumber,
    isDefaultImage,
    setIsDefaultImage,
    deskRef,
  } = useContext(LayoutConfigContext);

  const [post, setPost] = useState([]);
  // const [, setLocation] = useLocation();
  const [defaultName, setDefaultName] = useState("");
  const [imageFile, setImageFile] = useState([]);

  const [tempInitialDeskNumber, setTempInitialDeskNumber] = useState();

  useEffect(() => {
    if (props.id) {
      //to fetch space and desk data and set state values
      // getSpaceAndDeskData(id);
      // const fetchData = async () => {
      //   await getSpaceAndDeskData(props.id).then((data) => {
      //     // setweather(data);
      //   });
      // };
      // fetchData();
    } else {
      //set default state values, get list of spaces and set default name
      // axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
      axios.get("/api/space/getall").then((res) => {
        setPost(res.data);
      });
    }
  }, []);

  useEffect(() => {
    //FIX InitialDeskNumber for add desk
    if (props.id) {
      setInitialDeskNumber(Math.max(...post.map((val) => val.id)));
    } else setTempInitialDeskNumber(1);
    setDefaultName(`Example Space ${post.map((val) => val.name).length + 1}`);
    // console.log(defaultName);
  }, [post]);

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [defaultName, tempInitialDeskNumber]);

  const form_initialDeskNumber = Form.useWatch("initialDeskNumber", form);
  useEffect(() => {
    setInitialDeskNumber(form_initialDeskNumber);
  }, [form_initialDeskNumber]);

  const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  function nameExists(name) {
    return post.some(function (el) {
      return el.name === name;
    });
  }

  // function getBase64(file) {
  //   var reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = function () {
  //     setResult(reader.result);
  //   };
  //   reader.onerror = function (error) {
  //     console.log("Error: ", error);
  //   };
  // }

  // const getBase64 = (file) =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //     console.log(reader.result);
  //     return reader.result;
  //   });

  // const getBase64 = (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onload = () => reader.result;
  //   reader.onerror = (error) => reject(error);

  //   return reader.result;
  // };

  const imageUploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    customRequest: dummyRequest,

    beforeUpload(file, fileList) {
      //check file type
      console.log("checking file");
    },

    onRemove(file) {
      setImage(RoomImage);
      setIsDefaultImage(true);
    },

    onChange(info) {
      const { status } = info.file;

      /*converting to base 64*/
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setIsDefaultImage(false);
        // getBase64(info.file.originFileObj);
        const file = info.file.originFileObj;

        // let data = new FormData();
        // data.append("fileName", file.name);
        // data.append("file", file);

        setImageFile(file);
        setImage(URL.createObjectURL(file));
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  // useEffect(() => {
  //   console.log(imageFile);
  //   // setImage(result);
  // }, [imageFile]);

  return (
    <>
      <Form
        form={form}
        onFinish={(e) => {
          //on successful submit
          console.log("submit");
          console.log({
            desklist: deskRef.current,
            name: e.spacename.trim(),
            defaultImage: isDefaultImage,
            startingDesk: initialDeskNumber,
            ...(!isDefaultImage && { image: imageFile }),
          });

          let data = new FormData();
          data.append("name", e.spacename);
          data.append("deskList", JSON.stringify(deskRef.current));
          data.append("defaultImage", isDefaultImage);
          data.append("startingDesk", initialDeskNumber);
          !isDefaultImage && data.append("image", imageFile);

          // let data = {
          //   name: e.spacename,
          //   desklist: JSON.stringify(deskRef.current),
          //   defaultImage: isDefaultImage,
          //   startingDesk: initialDeskNumber,
          //   ...(!isDefaultImage && { image: imageFile }),
          // };
          //post req for new space
          axios
            .post("/api/space/addwithdesks", data)
            .then((res) => console.log(res))
            .catch((err) => {
              console.log(err);
            });
          console.log(result);
        }}
        initialValues={{
          spacename: defaultName,
          initialDeskNumber: tempInitialDeskNumber,
        }}
      >
        <div>
          <Header className="header">
            <h1 className="header-text">{props.name}</h1>
            <Button
              className="add-bookings-button"
              type="primary"
              shape="round"
              // icon={<PlusOutlined />}
              // onClick={() => {
              //   const data = [];
              //   console.log("clicked");
              //   console.log(post);
              //   // window.location.reload(false);
              // }}
              htmlType="submit"
            >
              Save Changes
            </Button>
          </Header>
          <div
            className="bar"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
              // coloumGap: "10px",
              // gridTemplateColumns: "auto auto auto",
              backgroundColor: "azure",
            }}
          >
            <div>
              <h3>Space Name:</h3>
              <Form.Item
                label={<span></span>}
                name="spacename"
                // initialValue={defaultName}
                rules={[
                  {
                    required: true,
                    message: "Please input the Space Name!",
                  },
                  {
                    message: "Name is already used.",
                    validator: (_, value) => {
                      if (!nameExists(value.trim())) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject();
                      }
                    },
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div>
              <h3>
                Starting Desk Number:{" "}
                <span>
                  <Tooltip
                    placement="topLeft"
                    title={
                      "Naming of desks will begin from this number. Default value is 1."
                    }
                    color={"#1890FF"}
                    arrowPointAtCenter
                  >
                    <InfoCircleOutlined style={{ color: "#1890FF" }} />
                  </Tooltip>
                </span>
              </h3>
              <Form.Item
                // getValueFromEvent={(value) => {
                //   console.log(value);
                //   setInitialDeskNumber(value);
                // }}
                // onChange={(event) => setInitialDeskNumber(event.target.value)}
                // onChange={(event) => console.log(event)}
                label={<span></span>}
                name="initialDeskNumber"
                // initialValue={initialDeskNumber}
                rules={[
                  {
                    required: true,
                    message: "A value must be entered",
                    // pattern: new RegExp(/^[0-9]+$/),
                  },
                ]}
              >
                <InputNumber
                  min={1}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </div>
            <div>
              <h3>Add Image:</h3>
              <Upload {...imageUploadProps}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </div>
            {/* <img src={image} /> */}
          </div>
          <div>
            <ImagePanZoomFunction></ImagePanZoomFunction>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ConfigureLayoutSettings;
