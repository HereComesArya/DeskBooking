import React, { useContext, useState, useEffect, useRef } from "react";
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
import ReactQuill, { Value } from "react-quill";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

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
  const [location, setLocation] = useLocation();

  const {
    spaceName,
    setSpaceName,
    initialDeskList,
    setInitialDeskList,
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
    richText,
    setRichText,
    rtcRef,
  } = useContext(LayoutConfigContext);

  const theme = props.id ? "bubble" : "snow";
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ header: [1, 2, 3, 4] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ color: [] }, { background: [] }],
    ],

    clipboard: {
      matchVisual: false,
    },
  };
  const placeholder = "Add directions...";
  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "header",
    "link",
    "color",
    "background",
  ];

  const [post, setPost] = useState([]);
  // const [, setLocation] = useLocation();
  const [defaultName, setDefaultName] = useState("");
  const [imageFile, setImageFile] = useState([]);

  const [tempInitialDeskNumber, setTempInitialDeskNumber] = useState();
  const [isFetched, setIsFetched] = useState(false);
  const [originalImage, setOriginalImage] = useState(RoomImage);
  useEffect(() => {
    if (props.id) {
      const getData = async () => {
        await getSpaceAndDeskData(props.id).then((data) => {
          // setIsLoading(false);
          // setDataSource(data);
          console.log(data);
          //setid
          // setSpaceName(data.name);
          setDefaultName(data.name);
          setInitialDeskNumber(data.startingDesk);
          setDeskList(data.desks);
          setInitialDeskList(data.desks);
          setRichText(data.directions);
          if (!data.defaultImage) {
            setImage(data.image);
            setOriginalImage(data.image);
            setIsDefaultImage(false);
          }
          setIsFetched(true);
        });
      };
      getData();
    } else {
      axios.get("/api/space/getall").then((res) => {
        setPost(res.data);
        setIsFetched(true);
      });
    }
  }, []);

  useEffect(() => {
    //FIX InitialDeskNumber for add desk
    if (props.id) {
      setTempInitialDeskNumber(initialDeskNumber);
      console.log("changing tempInitialDeskNumber");
      // setDefaultName(`Example Space ${post.map((val) => val.name).length + 1}`);
    } else {
      setTempInitialDeskNumber(1);
      // setDefaultName(`Example Space ${post.map((val) => val.name).length + 1}`);
    }
    // console.log(defaultName);
  }, [isFetched]);

  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    // console.log("changed form ", defaultName, tempInitialDeskNumber);
  }, [defaultName, tempInitialDeskNumber]);

  const form_initialDeskNumber = Form.useWatch("initialDeskNumber", form);
  useEffect(() => {
    setInitialDeskNumber(form_initialDeskNumber);
  }, [form_initialDeskNumber]);

  const dummyRequest = async ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  async function nameExists(name) {
    try {
      const res = await axios.get("/api/space/getall");
      return res.data.some((e) => e.name == name);
    } catch (error) {
      return false;
    }
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

    beforeUpload(file) {
      //check file type
      console.log("checking file");
      const isJpgOrPng =
        file.type === "image/jpeg" || file.type === "image/png";

      if (!isJpgOrPng) {
        message.error("You can only upload JPG/PNG file!");
      }

      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isLt5M) {
        message.error("Image must smaller than 5MB!");
      }

      return (isJpgOrPng && isLt5M) || Upload.LIST_IGNORE;
    },

    onRemove(file) {
      props.id ? setImage(originalImage) : setImage(RoomImage);
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
        layout={"vertical"}
        validateTrigger={["onFinish", "onChange"]}
        // onFinishFailed={(e) => console.log(e)}
        onFinish={(e) => {
          //on successful submit
          console.log("submit success");

          if (!props.id) {
            //* add new space
            let data = new FormData();
            data.append("name", e.spacename);
            data.append("directions", richText);
            data.append("deskList", JSON.stringify(deskRef.current));
            data.append("defaultImage", isDefaultImage);
            data.append("startingDesk", initialDeskNumber);
            !isDefaultImage && data.append("image", imageFile);
            console.log("wrong");
            // let data = {
            //   name: e.spacename,
            //   desklist: JSON.stringify(deskRef.current),
            //   defaultImage: isDefaultImage,
            //   startingDesk: initialDeskNumber,
            //   ...(!isDefaultImage && { image: imageFile }),
            // };
            //post to add new space
            axios
              .post("/api/space/addwithdesks", data)
              .then((res) => console.log(res))
              .catch((err) => {
                console.log(err);
              });
            setLocation(`/manage-spaces`);
          } else {
            //* modify space

            let modifiedData = {
              spaceId: props.id,
              name: e.spacename,
              directions: richText,
              initialDeskNo: initialDeskNumber,
              deskList: deskRef.current,
            };

            console.log(modifiedData);
            axios
              .post("/api/space/modifyspace", modifiedData)
              .then((res) => console.log(res))
              .catch((err) => {
                console.log(err);
              });
            setLocation(`/manage-spaces`);
          }
        }}
        initialValues={
          props.id
            ? {
                spacename: defaultName,
                richtext: richText,
                initialDeskNumber: tempInitialDeskNumber,
              }
            : {
                // spacename: defaultName,
                richtext: richText,
                initialDeskNumber: tempInitialDeskNumber,
              }
        }
      >
        <div>
          <Header className="header">
            <h1 className="header-text">{props.name}</h1>
            <Button
              className="add-bookings-button"
              type="primary"
              shape="round"
              // icon={<PlusOutlined />}
              htmlType="submit"
            >
              {props.id ? "Save Changes" : "Create"}
            </Button>
          </Header>
          <div
            className="bar"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              // coloumGap: "10px",
              // gridTemplateColumns: "auto auto auto",
              // backgroundColor: "azure",
            }}
          >
            <div>
              <Form.Item
                label={"Space Name"}
                name="spacename"
                rules={[
                  {
                    required: true,
                    message: "Please input the Space Name!",
                  },
                  {
                    message: "Name is already in use!",
                    validator: async (_, value) => {
                      value = value ?? "";
                      if (props.id && value.trim() == defaultName) {
                        return Promise.resolve();
                      } else if (
                        value.trim() == "" ||
                        !(await nameExists(value.trim()))
                      ) {
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
              <Form.Item
                label={
                  <>
                    <span>Starting Desk Number </span>
                    <span>
                      <Tooltip
                        placement="topLeft"
                        title={
                          "Naming of desks will begin from this number. Default value is 1."
                        }
                        color={"#1890FF"}
                        arrowPointAtCenter
                        style={{ paddingLeft: 10 }}
                      >
                        <InfoCircleOutlined style={{ color: "#1890FF" }} />
                      </Tooltip>
                    </span>
                  </>
                }
                name="initialDeskNumber"
                rules={[
                  {
                    required: true,
                    message: "A value must be entered",
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
            {props.id == undefined && (
              <Form.Item label={<span>Add Image</span>}>
                <Upload {...imageUploadProps}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            )}
          </div>
          <div className="rich-text-form">
            {/* //* Rich text component */}
            <Form.Item
              required
              label={
                <>
                  <span></span>
                  <span>Directions to the Space</span>
                </>
              }
              validateTrigger="onChange"
              name="richtext"
              rules={[
                () => ({
                  validator(_, value) {
                    value = value ?? "";

                    const sanitizedValue = value
                      .replace(/<\/?[\w]+>/gi, "")
                      .replace(/\s+/, "");

                    const isBlank = sanitizedValue === "";
                    if (isBlank) {
                      return Promise.reject(new Error("Cannot be blank!"));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}
            >
              <ReactQuill
                theme={"snow"}
                modules={modules}
                formats={formats}
                onChange={setRichText}
                placeholder={placeholder}
                style={{
                  width: "100%",
                  height: 100,
                  marginBottom: 70,
                }}
                ref={rtcRef}
              />
            </Form.Item>
            <ImagePanZoomFunction></ImagePanZoomFunction>
          </div>
        </div>
      </Form>
    </>
  );
};

export default ConfigureLayoutSettings;
