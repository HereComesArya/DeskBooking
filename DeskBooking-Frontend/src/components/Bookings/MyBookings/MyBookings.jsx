import React, { useRef, useState, useEffect, useContext } from "react";
import { Button, Input, Space, Table, Modal, Tooltip, Tag } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  EnvironmentTwoTone,
  CloseCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { getFormattedMyBookingsData } from "../../../utils/services";
import moment from "moment";
import axios from "axios";

import "./MyBookings.css";
import "antd/dist/antd.css";
import BookingsModal from "../Modal/BookingsModal";

const MyBookings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const getData = async () => {
      await getFormattedMyBookingsData().then((data) => {
        setIsLoading(false);
        setDataSource(data);
      });
    };
    getData();
  }, []);

  const [editBookingId, setEditBookingId] = useState("");

  const onDelete = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this booking?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        console.log(data);
        setData((prev) => {
          const art = data.filter(
            (booking) => booking.bookingId !== record.bookingId
          );
          console.log(art);
        });
      },
    });
  };

  // const [newData, setNewData] = useState([]);

  // useEffect(() => {
  //   // console.log("in ue");
  //   const modifiedData = [];

  //   //   const [newData, setNewData] = useState([]);
  //   // console.log(modifiedData);
  //   console.log(data);
  //   // data &&
  //   //   {
  //   data.map((dataItem, index) => {
  //     const {
  //       userId,
  //       bookingId,
  //       roomId,
  //       startTime,
  //       endTime,
  //       deskId,
  //       user: { firstName },
  //       user: { lastName },
  //     } = dataItem;

  //     const booking = new Object();
  //     booking.key = index;
  //     booking.deskId = deskId;
  //     booking.name = firstName + " " + lastName;
  //     booking.userId = userId;
  //     booking.roomId = roomId;
  //     booking.bookingId = bookingId;
  //     booking.dateFormatted = moment(startTime).format("Do MMM, YYYY");
  //     booking.date = moment(startTime);
  //     booking.startTimeFormatted = moment(startTime).format("h: mm A");
  //     booking.startTime = moment(startTime);
  //     booking.endTimeFormatted = moment(endTime).format("h: mm A");
  //     booking.endTime = moment(endTime);

  //     modifiedData.push(booking);
  //     // console.log(newData);
  //     // console.log("start " + booking.startTimeFormatted);
  //     // console.log("end " + booking.endTimeFormatted);
  //     // console.log("date  " + booking.date);
  //     // console.log("date  " + booking.dateFormatted);
  //     //   console.log(modifiedData);
  //   });
  //   // }
  //   // setNewData(modifiedData);
  // }, [data]);

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
      //! not checked
      align: "center",
      title: "Desk No.",
      dataIndex: "deskNo",
      key: "index",
      id: "index",
      width: "10%",
      sorter: (a, b) => parseInt(a).deskName - parseInt(b).deskName,
      ...getColumnSearchProps("deskName"),
      render: (text, record, index) => {
        return `D${record.deskNo}`;
      },
    },
    // {
    //   //checked
    //   title: "Room ID",
    //   dataIndex: "roomId",
    //   key: "index",
    //   id: "index",
    //   width: "10%",
    //   sorter: (a, b) => a.roomId - b.roomId,
    //   ...getColumnSearchProps("roomId"),
    // },
    {
      //Checked
      align: "center",
      title: "Space Name",
      dataIndex: "spaceName",
      key: "index",
      id: "index",
      width: "20%",
      sorter: (a, b) => a.spaceName.localeCompare(b.spaceName),
      ...getColumnSearchProps("spaceName"),
    },
    {
      //! not checked
      // align: "center",
      title: "Start",
      dataIndex: "start",
      id: "index",
      key: "index",
      width: "20%",
      showSorterTooltip: true, // change this
      ...getColumnSearchProps("startDate"),
      sorter: (a, b) => {
        a.date - b.date;
        console.log(
          moment(a.date, "DD-MM-YYYY").unix() -
            moment(b.date, "DD-MM-YYYY").unix()
        );
        console.log(a.date);
      },
      render: (text, record, index) => {
        return (
          moment(record.startTime).format("h:mm A, ") +
          moment(record.startDate).format("D MMM, YYYY")
        );
      },
      //   sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      //! not checked
      // align: "center",
      title: "End",
      dataIndex: "endDate",
      id: "index",
      key: "index",
      width: "20%",
      showSorterTooltip: true, // change this
      ...getColumnSearchProps("endDate"),
      sorter: (a, b) => {
        a.date - b.date;
        console.log(
          moment(a.date, "DD-MM-YYYY").unix() -
            moment(b.date, "DD-MM-YYYY").unix()
        );
        console.log(a.date);
      },
      render: (text, record, index) => {
        return (
          moment(record.endTime).format("h:mm A, ") +
          moment(record.endDate).format("D MMM, YYYY")
        );
      },
      //   sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },
    {
      //! not checked
      align: "center",
      title: "Status",
      dataIndex: "status",
      id: "index",
      key: "index",
      width: "15%",
      render: (text, record, index) => {
        // console.log(record);
        //* cancelled, upcomming, ongoing   ( and expired )
        if (record.cancelled) {
          //* cancelled by admin
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              cancelled
            </Tag>
          );
        } else if (moment().isBefore(`${record.startTime}`)) {
          //! NEEDS FIX, date and time are split. Join and compare
          //* upcoming
          console.log(moment().format());
          console.log(record.startTime);
          return (
            <Tag icon={<ClockCircleOutlined spin />} color="geekblue">
              upcoming
            </Tag>
          );
        } else {
          //! NEEDS FIX, Filter out expired bookings
          //? FIltered on frontend for now.
          //* ongoing
          return (
            <Tag icon={<SyncOutlined spin />} color="success">
              ongoing
            </Tag>
          );
        }
      },
      //   sorter: (a, b) => moment(a).unix() - moment(b).unix(),
    },

    {
      align: "center",
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        return (
          <>
            <Tooltip
              placement="left"
              title={
                <div
                  className="content"
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "auto",
                    // border: "1px solid red",
                    width: "220px",
                    color: "black",
                    // float: "left",
                    height: "100px",
                    // position: "relative",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: record.directions,
                  }}
                ></div>
              }
              color="#ebf0f5"
            >
              <EnvironmentTwoTone style={{ color: "green" }} />
            </Tooltip>
            {/* <EditOutlined
              onClick={() => {
                // onEditStudent(record);
                // console.log(`edit ${record}`);
                console.log("edit ", record);
                setOpen(true);
                setEditBookingId(record.bookingId);
              }}
              style={{ marginLeft: 12 }}
            /> */}
            <DeleteOutlined
              onClick={(e) => {
                // onDelete(record.spaceId, e);
                // onDeleteStudent(record);
                // this.onDelete(record.key, e);
                console.log("delete ", record.key);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
          </>
        );
      },
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

  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    console.log("Received values of form: ", values);
    setOpen(false);
  };

  return (
    <>
      <Table
        scroll={{
          x: 900,
        }}
        pagination={{
          position: ["bottomRight"],
        }}
        columns={columns}
        dataSource={dataSource}
      />
      <BookingsModal
        bookingId={editBookingId}
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </>
  );
};

export default MyBookings;
