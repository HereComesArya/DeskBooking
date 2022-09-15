import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";
import React, { useRef, useState, useEffect } from "react";
import moment from "moment";
import axios from "axios";

import "./AllBookings.css";
import "antd/dist/antd.css";

const App = () => {
  const [post, setPost] = useState(null);
  useEffect(() => {
    axios.get("/api/booking/getall").then((res) => {
      setPost(res.data);
    });
  }, []);

  console.log(post);

  const data = [
    {
      bookingId: 0,
      user: {
        userId: 0,
        email: "bobvance@vancerefrigiration.com",
        firstName: "Bob",
        lastName: "Vance",
      },
      userId: 0,
      startTime: "2022-08-14T10:00:30Z",
      endTime: "2022-08-14T11:30:00Z",
      desk: null,
      deskId: 0,
      roomId: 0,
    },
    {
      bookingId: 1,
      user: {
        userId: 0,
        email: "nevan@nevan",
        firstName: "Nevan",
        lastName: "Nevan",
      },
      userId: 2,
      startTime: "2022-09-09T10:30Z",
      endTime: "2022-09-09T12:00Z",
      desk: null,
      deskId: 1,
      roomId: 0,
    },
    {
      bookingId: 2,
      user: {
        userId: 3,
        email: "jam@jam.com",
        firstName: "jam",
        lastName: "jam",
      },
      userId: 3,
      startTime: "2022-09-13T09:00:30Z",
      endTime: "2022-09-13T10:00:00Z",
      desk: null,
      deskId: 2,
      roomId: 0,
    },
  ];

  const newData = [];
  {
    data.map((dataItem, index) => {
      const {
        userId,
        bookingId,
        roomId,
        startTime,
        endTime,
        deskId,
        user: { firstName },
        user: { lastName },
      } = dataItem;

      const booking = new Object();
      booking.key = index;
      booking.deskId = deskId;
      booking.name = firstName + " " + lastName;
      booking.userId = userId;
      booking.roomId = roomId;
      booking.bookingId = bookingId;
      booking.dateFormatted = moment(startTime).format("Do MMM, YYYY");
      booking.date = moment(startTime);
      booking.startTimeFormatted = moment(startTime).format("h: mm A");
      booking.startTime = moment(startTime);
      booking.endTimeFormatted = moment(endTime).format("h: mm A");
      booking.endTime = moment(endTime);

      newData.push(booking);
      // console.log(newData);
      // console.log("start " + booking.startTimeFormatted);
      // console.log("end " + booking.endTimeFormatted);
      // console.log("date  " + booking.date);
      // console.log("date  " + booking.dateFormatted);
    });
  }

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
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
          </Button>
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
      align: "center",
      title: "Desk ID",
      dataIndex: "deskId",
      key: "index",
      id: "index",
      width: "10%",
      sorter: (a, b) => a.deskId - b.deskId,
      ...getColumnSearchProps("deskId"),
    },
    {
      //checked
      title: "Room ID",
      dataIndex: "roomId",
      key: "index",
      id: "index",
      width: "10%",
      sorter: (a, b) => a.roomId - b.roomId,
      ...getColumnSearchProps("roomId"),
    },
    {
      //Checked
      title: "User",
      dataIndex: "name",
      key: "index",
      id: "index",
      width: "20%",
      sorter: (a, b) => a.name.localeCompare(b.name),
      ...getColumnSearchProps("name"),
    },
    {
      title: "Date",
      dataIndex: "dateFormatted",
      id: "index",
      key: "index",
      width: "15%",
      showSorterTooltip: false, // change this
      ...getColumnSearchProps("dateFormatted"),
      sorter: (a, b) => {
        a.date - b.date;
        console.log(
          moment(a.date, "DD-MM-YYYY").unix() -
            moment(b.date, "DD-MM-YYYY").unix()
        );
        console.log(a.date);
      },
      //   sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      title: "Start Time",
      dataIndex: "startTimeFormatted",
      id: "index",
      key: "index",
      width: "20%",
      ...getColumnSearchProps("startTimeFormatted"),
      sorter: (a, b) => a.startTime - b.startTime,
    },
    {
      title: "End Time",
      dataIndex: "endTimeFormatted",
      key: "index",
      id: "index",
      width: "20%",
      ...getColumnSearchProps("endTimeFormatted"),
      sorter: (a, b) => b.endTime - a.endTime,
    },
    // {
    //   title: "Address",
    //   dataIndex: "address",
    //   key: "address",
    //     ...getColumnSearchProps("address"),
    //     sorter: (a, b) => a.address.length - b.address.length,
    //     sortDirections: ["descend", "ascend"],
    // },
  ];
  console.log("hi");

  return (
    <Table
      scroll={{
        x: 900,
      }}
      pagination={{
        position: ["topLeft", "bottomLeft"],
      }}
      columns={columns}
      dataSource={newData}
    />
  );
};

// const App = () => {
//   const baseURL = "https://jsonplaceholder.typicode.com/posts/1";
//   const [post, setPost] = useState(null);

//   useEffect(() => {
//     axios.get(baseURL).then((response) => {
//       setPost(response.data);
//     });
//   }, []);

//   if (!post) return null;

//   return (
//     <div>
//       <h1>{post.title}</h1>
//       <p>{post.body}</p>
//     </div>
//   );
// };

export default App;
