import React, { useState, useEffect } from "react";
import { Tag, Form, Avatar, Input, Button } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import { UserContext } from "../../App";
import { useContext } from "react";
import axios from "axios";

import "./Profile.css";
import "antd/dist/antd.css";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [defaultName, setDefaultName] = useState("");
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    setDefaultName(user.name);
  }, [post]);

  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [defaultName]);

  const divStyles = {
    webkitBoxShadow: "22px 19px 54px -22px rgba(0,0,0,0.75)",
    mozBoxShadow: "22px 19px 54px -22px rgba(0,0,0,0.75)",
    boxShadow: "22px 19px 54px -22px rgba(0,0,0,0.75)",

    margin: "auto   ",
    padding: "50px ",
    width: "30vw",
    height: "500px",
    background: "white",
    borderRadius: "50px",
  };

  const [disabled, setDisabled] = useState(true);
  const toggle = () => {
    setDisabled(!disabled);
  };

  return (
    <>
      <section style={divStyles} className="para">
        <div className="form" style={{ marginTop: "-40px" }}>
          <div>
            <h1
              style={{
                marginBottom: "0.5em",
                color: "#1890ff",
                fontWeight: "500",
                fontSize: "40px",
                marginLeft: "120px",
              }}
            >
              Profile
            </h1>

            <div>
              <Avatar
                style={{
                  width: "200px",
                  height: "200px",
                  lineHeight: "32px",
                  borderRadius: " 50%",
                  marginLeft: "75px",
                }}
                src={user.photoUri}
              />
            </div>

            <div className="tag">
              <Tag>{user.isAdmin ? "Admin" : "User"}</Tag>
            </div>

            <div>
              <Form
                colon={false}
                form={form}
                onFinish={(e) => {
                  console.log({
                    name: e.name,
                    user
                  });
                  // let data = new FormData();
                  // data.append("name", e.name);
                  //axios.post()
                  //setuser
                  const obj = {fullName: e.name}
                  axios.put(`/api/Profile/changename`,e.name, { headers: {'Content-Type': 'application/json'} } ).then(res => console.log(res));
                  setUser({...user, obj})
                }}
              >
                <div className="profile-name-input">
                  <Form.Item
                    label=""
                    name="name"
                    initialValue={defaultName}
                    rules={[
                      {
                        required: true,
                        message: "Please input Your Name!",
                      },
                    ]}
                  >
                    <Input
                      style={{ fontSize: "18px" }}
                      bordered={false}
                      disabled={disabled}
                    ></Input>
                  </Form.Item>
                </div>
                <div className="linkbutton">
                  <Button type="link" onClick={toggle}>
                    <EditTwoTone />
                  </Button>
                </div>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{
                    marginLeft: "115px",
                    borderRadius: "50px",
                    top: "-20px",
                  }}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
