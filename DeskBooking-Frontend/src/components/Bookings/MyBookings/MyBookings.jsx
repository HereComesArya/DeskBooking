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

  const onDelete = (bookingId) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this booking?",
      okText: "Yes",
      okType: "danger",
      style: { marginTop: "100px" },
      onOk: () => {
        axios
          .delete(`/api/Booking/delete?bookingId=${bookingId}`)
          .then((res) => console.log(res))
          .catch((error) => console.log(error));
        const data = dataSource.filter((item) => item.bookingId !== bookingId);
        setDataSource(data);
      },
    });
  };

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
      // key: "index",
      // id: "index",
      width: "10%",
      sorter: {
        compare: (a, b) => {
          const a1 = a.deskNo ?? "";
          const b1 = b.deskNo ?? "";
          return a1.localeCompare(b1);
        },
        multiple: 3,
      },
      ...getColumnSearchProps("deskNo"),
      render: (text, record, index) => {
        return record.cancelled ? `-` : `D${record.deskNo}`;
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
      // key: "index",
      // id: "index",
      width: "20%",
      sorter: {
        compare: (a, b) => a.spaceName.localeCompare(b.spaceName),
        multiple: 1,
      },
      ...getColumnSearchProps("spaceName"),
    },
    {
      //checked
      // align: "center",
      title: "Start",
      dataIndex: "start",
      // id: "index",
      // key: "index",
      width: "20%",
      sorter: {
        compare: (a, b) => {
          console.log(a.startDate, a.startTime);
          console.log(b.startDate, b.startTime);

          let sd1 = a.startDate.substr(0, 10);
          let sd2 = b.startDate.substr(0, 10);

          let st1 = a.startTime.substr(10);
          let st2 = b.startTime.substr(10);

          let x = `${sd1}${st1}`;
          let y = `${sd2}${st2}`;
          console.log(x, y);
          return moment(x).diff(moment(y));
        },
        multiple: 2,
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
      //checked
      // align: "center",
      title: "End",
      dataIndex: "endDate",
      // id: "index",
      // key: "index",
      width: "20%",
      sorter: {
        compare: (a, b) => {
          console.log(a.endDate, a.endTime);
          console.log(b.endDate, b.endTime);

          let sd1 = a.endDate.substr(0, 10);
          let sd2 = b.endDate.substr(0, 10);

          let st1 = a.endTime.substr(10);
          let st2 = b.endTime.substr(10);

          let x = `${sd1}${st1}`;
          let y = `${sd2}${st2}`;
          console.log(x, y);
          return moment(x).diff(moment(y));
        },
        multiple: 2,
      },
      render: (text, record, index) => {
        return (
          moment(record.endTime).format("h:mm A, ") +
          moment(record.endDate).format("D MMM, YYYY")
        );
      },
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

        let endDateTime = `${record.endDate.substr(
          0,
          10
        )}${record.endTime.substr(10)}`;

        let startDateTime = `${record.startDate.substr(
          0,
          10
        )}${record.startTime.substr(10)}`;

        if (record.cancelled) {
          //* cancelled by admin
          return (
            <Tag icon={<CloseCircleOutlined />} color="error">
              cancelled
            </Tag>
          );
        } else if (moment().isBefore(moment(startDateTime))) {
          //* upcoming
          return (
            <Tag icon={<ClockCircleOutlined spin />} color="geekblue">
              upcoming
            </Tag>
          );
        } else {
          //? expired FIltered on backend.
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
                onDelete(record.bookingId);
                console.log("delete ", record.bookingId);
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
      {/* <BookingsModal
        bookingId={editBookingId}
        open={open}
        onCreate={onCreate}
        onCancel={() => {
          setOpen(false);
        }}
      /> */}
    </>
  );
};

export default MyBookings;
