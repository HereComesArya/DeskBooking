import axios from "axios";

const getSpaceData = (id) => {
  //change url
  return axios
    .get(`/api/Space/getspace?spaceId=${id}`)
    .then((data) => formatSpaceData(data));
};

const getDeskData = (id) => {
  //change url
  return axios.get(`/api/Desk/getall?spaceId=${id}`);
};

const formatSpaceData = (data) => {
  const { spaceId, initialDeskNo, name, image, defaultImage } = data;

  return {
    spaceId,
    initialDeskNo,
    name,
    image,
    defaultImage,
  };
};

const getSpaceAndDeskData = async (searchParams) => {
  const spaceData = await getSpaceData(searchParams).then(formatSpaceData);

  const deskData = await getDeskData(searchParams);

  return { ...spaceData, ...deskData };
};

const getFormattedSpaceData = async () => {
  let finalData = [];
  await axios.get(`/api/space/getall`).then((res) => {
    res.data.forEach((space, index) => {
      finalData.push({
        key: index,
        SpaceId: space.spaceId,
        SpaceName: space.name,
      });
    });
  });
  return finalData;
};

export default getSpaceAndDeskData;

export { getFormattedSpaceData };
