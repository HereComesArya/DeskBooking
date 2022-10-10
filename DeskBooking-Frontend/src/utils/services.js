import axios from "axios";

const getSpaceData = async (id) => {
  //change url
  try {
    const res = await axios.get(`/api/Space/getspace?spaceId=${id}`);
    return res.data;
  } catch (error) {
    return console.log(error);
  }
  // .then((res) => formatSpaceData(res.data))
};

const getDeskData = async (id) => {
  //change url
  try {
    const result = await axios
      .get(`/api/Desk/getall?spaceId=${id}`)
      .then((res) => {
        return formatDeskData(res.data);
      });
    return result;
  } catch (error) {
    return console.log(error);
  }
};

const formatDeskData = (data) => {
  const finalData = [];

  //   deskId: 1
  // spaceId: 33
  // xcoordinate: 469.60434
  // ycoordinate: 454.12286

  /*
  id: deskId,
  x: x,
  y: y,
*/
  console.log(data);
  data.forEach((desk, index) => {
    finalData.push({
      id: desk.deskId,
      x: desk.xcoordinate,
      y: desk.ycoordinate,
    });
  });
  console.log(finalData);
  return finalData;
};

// const formatSpaceData = (data) => {
//   const { spaceId, initialDeskNo, name, image, defaultImage } = data;

//   return {
//     spaceId,
//     initialDeskNo,
//     name,
//     image,
//     defaultImage,
//   };
// };

const getSpaceAndDeskData = async (searchParams) => {
  const spaceData = await getSpaceData(searchParams);
  // .then((res) => console.log("res"));
  const deskData = await getDeskData(searchParams);
  console.log(deskData);
  return { ...spaceData, desks: [...deskData] };
};

//list of spaces
const getFormattedSpaceData = async () => {
  let finalData = [];
  await axios.get(`/api/space/getall`).then((res) => {
    res.data.forEach((space, index) => {
      finalData.push({
        key: index,
        spaceId: space.spaceId,
        spaceName: space.name,
        numberOfDesks: space.numberOfDesks,
      });
    });
  });
  return finalData;
};

const getFormattedMyBookingsData = async () => {
  let finalData = [];
  await axios.get(`/api/booking/mybookings`).then((res) => {
    console.log(res.data);
    res.data.forEach((booking, index) => {
      finalData.push({
        key: index,
        bookingId: booking.bookingId,
        cancelled: booking.cancelled,
        //! Waiting for API update
        //! spaceName: booking.name,
        deskId: booking.deskId,
        deskNo: booking.deskName,
        spaceId: booking.spaceId,
        spaceName: booking.spaceName,
        startTime: booking.startTime,
        endTime: booking.endTime,
        startDate: booking.startDate,
        endDate: booking.endDate,
        directions: booking.spaceDirections,
      });
    });
    // console.log(res.data);
  });
  return finalData;
};

const getAvailableDesks = async (searchParams) => {
  let deskList = [];
  await axios
    .get(
      `/getavail?spaceId=${searchParams.spaceId}&startDate=${searchParams.startDate}&endDate=${searchParams.endDate}&startTime=${searchParams.startTime}&endTime=${searchParams.endTime}`
    )
    .then((res) => {
      // res.data.forEach((booking, index) => {
      //   finalData.push({
      //     key: index,
      //     bookingId: booking.bookingId,
      //     // spaceName: booking.name,
      //     deskId: booking.deskId,
      //     spaceId: booking.spaceId,
      //     startTime: booking.startTime,
      //     endTime: booking.endTime,
      //     startDate: booking.startDate,
      //     endDate: booking.endDate,
      //   });
      // });
      console.log(res.data);
    });
  return {};
};

export default getSpaceAndDeskData;

export { getFormattedSpaceData, getFormattedMyBookingsData, getAvailableDesks };
