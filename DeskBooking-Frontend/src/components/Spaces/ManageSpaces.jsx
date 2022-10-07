import React, { useRef, useState, useEffect } from "react";
// import { Routes, Route, useNavigate } from "react-router-dom";
import { useLocation, Link } from "wouter";
import axios from "axios";
import { getFormattedSpaceData } from "../../utils/services";

import { Button, Input, Space, Table, Layout, Modal, Affix } from "antd";
const Header = Layout;
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  UploadOutlined,
  InfoCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

import "./ManageSpaces.css";
import "antd/dist/antd.css";

const ManageSpaces = () => {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await getFormattedSpaceData().then((data) => {
        setIsLoading(false);
        setDataSource(data);
      });
    };
    getData();
  }, []);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm({
      closeDropdown: false,
    });
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const onDelete = (SpaceId, e) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this space?",
      okText: "Yes",
      okType: "danger",
      style: { marginTop: "100px" },
      onOk: () => {
        //add axios delete space
        const data = dataSource.filter((item) => item.spaceId !== SpaceId);
        setDataSource(data);
      },
    });
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          {/* <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button> */}
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      //checked
      title: "ID",
      dataIndex: "spaceId",
      key: "index",
      id: "index",
      align: "center",
      //   width: "20%",
      sorter: (a, b) => a.SpaceId - b.SpaceId,
      ...getColumnSearchProps("spaceId"),
    },
    {
      //Checked
      title: "Name",
      dataIndex: "spaceName",
      align: "center",
      key: "index",
      id: "index",
      //   width: "40%",
      sorter: (a, b) => a.SpaceName.localeCompare(b.SpaceName),
      ...getColumnSearchProps("spaceName"),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                // onEditStudent(record);
                // console.log(`edit ${record}`);
                // console.log(record);
                setLocation(`/customize-space/${record.spaceId}`);
              }}
            />
            <DeleteOutlined
              onClick={(e) => {
                onDelete(record.spaceId, e);
                // onDeleteStudent(record);
                // this.onDelete(record.key, e);
                // console.log(record.SpaceId);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

  return (
    <>
      <Header className="manage-spaces-header">
        <h1 className="manage-spaces-header-text">Manage Spaces</h1>
        <Button
          onClick={() => setLocation("/customize-space")}
          className="new-booking-button"
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
          Add New Space
        </Button>
      </Header>
      <Table
        loading={isLoading}
        scroll={{
          x: 900,
        }}
        pagination={{
          position: ["bottomRight"],
        }}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  );
};

export default ManageSpaces;
