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
  const [post, setPost] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    // axios.get("/api/booking/getall").then((res) => {
    //   setPost(res.data);
    // });
    // getFormattedSpaceData().then((data) => {
    //   setIsLoading(false);
    //   console.log(data);
    //   setDataSource(data);
    // });

    const getData = async () => {
      await getFormattedSpaceData().then((data) => {
        setIsLoading(false);
        setDataSource(data);
      });
    };
    getData();
  }, []);

  //   const data = post;

  /*to be removed, add async get desks function in services.js*/
  // useEffect(() => {
  //   const data = [];

  //   for (let i = 0; i < 46; i++) {
  //     data.push({
  //       key: i,
  //       SpaceId: i + 1,
  //       SpaceName: `Example Space #${i + 1}`,
  //     });
  //   }
  //   setDataSource(data);
  // }, []);

  //   const newData = [];
  //   {
  //     data &&
  //       data.map((dataItem, index) => {
  //         const {
  //           userId,
  //           bookingId,
  //           roomId,
  //           startTime,
  //           endTime,
  //           deskId,
  //           user: { firstName },
  //           user: { lastName },
  //         } = dataItem;

  //         const booking = new Object();
  //         booking.key = index;
  //         booking.deskId = deskId;
  //         booking.name = firstName + " " + lastName;
  //         booking.userId = userId;
  //         booking.roomId = roomId;
  //         booking.bookingId = bookingId;
  //         booking.dateFormatted = moment(startTime).format("Do MMM, YYYY");
  //         booking.date = moment(startTime);
  //         booking.startTimeFormatted = moment(startTime).format("h: mm A");
  //         booking.startTime = moment(startTime);
  //         booking.endTimeFormatted = moment(endTime).format("h: mm A");
  //         booking.endTime = moment(endTime);

  //         newData.push(booking);
  //         // console.log(newData);
  //         // console.log("start " + booking.startTimeFormatted);
  //         // console.log("end " + booking.endTimeFormatted);
  //         // console.log("date  " + booking.date);
  //         // console.log("date  " + booking.dateFormatted);
  //       });
  //   }

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
    //add axios delete space
    const data = dataSource.filter((item) => item.SpaceId !== SpaceId);
    setDataSource(data);
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
      dataIndex: "SpaceId",
      key: "index",
      id: "index",
      align: "center",
      //   width: "20%",
      sorter: (a, b) => a.SpaceId - b.SpaceId,
      ...getColumnSearchProps("SpaceId"),
    },
    {
      //Checked
      title: "Name",
      dataIndex: "SpaceName",
      align: "center",
      key: "index",
      id: "index",
      //   width: "40%",
      sorter: (a, b) => a.SpaceName.localeCompare(b.SpaceName),
      ...getColumnSearchProps("SpaceName"),
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
                setLocation(`/add-space/${record.SpaceId}`);
              }}
            />
            <DeleteOutlined
              onClick={(e) => {
                onDelete(record.SpaceId, e);
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
          onClick={() => setLocation("/add-space")}
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
