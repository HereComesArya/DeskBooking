import React, { useContext, useState, useEffect } from "react";
import { LayoutConfigContext } from "../../../helpers/contexts/AdminLayoutConfigContext";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import ImagePanZoomFunction from "../../ImagePanZoom/ImagePanZoomFunction";
import { Route, Redirect, useLocation } from "wouter";

import { Switch, Button, Input, Layout, message, Upload, Form } from "antd";
const { Header } = Layout;

import "./ConfigureLayoutSettings.css";
import "antd/dist/antd.css";

const ConfigureLayoutSettings = () => {
  useEffect(() => {
    const val = 0;
    //to fetch number of spaces to set defaullt name in add spaces
  }, []);

  const [, setLocation] = useLocation();
  const [spaceId, setSpaceId] = useState(0);
  const [defaultName, setDefaultName] = useState(
    `Example Space ${spaceId + 1}`
  );
  const [isNameNotTaken, setIsNameNotTaken] = useState(false);

  const {
    spaceName,
    setSpaceName,
    deskList,
    setDeskList,
    id,
    setId,
    isAdding,
    setIsAdding,
    isDeleting,
    setIsDeleting,
    image,
    setImage,
    deskName,
    setDeskName,
    addRef,
    deleteRef,
    // imgRef,
    deskRef,
  } = useContext(LayoutConfigContext);

  function handleImageupload(e) {
    console.log(e.target.files);
    setImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <>
      <Form
        onFinish={(e) => {
          console.log({ desklist: deskRef, name: e.spacename });
        }}
      >
        <div>
          <Header className="header">
            <h1 className="header-text">Add Space</h1>
            <Button
              className="add-bookings-button"
              type="primary"
              shape="round"
              icon={<PlusOutlined />}
              onClick={() => {
                const data = [];
                console.log("clicked");
                // window.location.reload(false);
              }}
              htmlType="submit"
            >
              Add New Space
            </Button>
          </Header>
          <div
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
                initialValue={defaultName}
                rules={[
                  {
                    required: true,
                    message: "Please input the Space Name!",
                  },
                  {
                    required: isNameNotTaken,
                    message: "This name is already in use!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div>
              <h3>Add Image:</h3>
              <input type="file" onChange={handleImageupload} />
            </div>
            {/* <img src={image} /> */}
            <div>
              <h3>Add Desks</h3>
              <Switch
                checked={isAdding}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                onClick={() => {
                  setIsAdding(!isAdding);
                  setIsDeleting(false);
                }}
              />
              <h3>{String(isAdding)}</h3>
            </div>
            <div>
              <h3>Delete Desks</h3>
              <Switch
                checked={isDeleting}
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                defaultChecked
                onClick={() => {
                  setIsDeleting(!isDeleting);
                  setIsAdding(false);
                }}
              />
              <h3>{String(isDeleting)}</h3>
            </div>
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
