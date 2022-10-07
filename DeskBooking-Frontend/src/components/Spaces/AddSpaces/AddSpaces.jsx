import React, { useRef, useState, useEffect } from "react";
import ConfigureLayoutSettings from "../AdminConfigLayout/ConfigureLayoutSettings";
import { LayoutConfigContext } from "../../../helpers/contexts/AdminLayoutConfigContext";
import RoomImage from "../../../assets/images/empty-grid.jpg";
import axios from "axios";
import getSpaceAndDeskData from "../../../utils/services";

const AddSpaces = (props) => {
  /*Name of the new space*/
  const [spaceName, setSpaceName] = useState("");

  /*Test isAdmin, supposed to be in auth context*/

  /*Image inside viewer*/
  const [image, setImage] = useState(RoomImage);

  /*Use default image*/
  const [isDefaultImage, setIsDefaultImage] = useState(true);

  //holds the id of the last desk, equal to length of desklist
  const [deskId, setDeskId] = useState(1);

  //Starting desk number
  const [initialDeskNumber, setInitialDeskNumber] = useState(1);
  // const initialDeskNumberRef = useRef();
  // initialDeskNumberRef.current = initialDeskNumber;

  //List of desks(id, name, x, y)
  const [deskList, setDeskList] = useState([]);

  //used to set the desklist for editting spaces. There's probably a better way to do this.
  const [initialDeskList, setInitialDeskList] = useState([]);

  /* Ref for deskList*/
  const deskRef = useRef([]);
  deskRef.current = deskList;

  // /* List of added desks*/
  // const [addedDesks, setAddedDesks] = useState([]);

  // /* Ref for addedDesks*/
  // const addedDesksRef = useRef([]);
  // addedDesksRef.current = addedDesks;

  // /* List of removed desks*/
  // const [removedDesks, setRemovedDesks] = useState([]);

  // /* Ref for addedDesks*/
  // const removedDesksRef = useRef([]);
  // removedDesksRef.current = removedDesks;

  /* Ref for embedded image*/
  // const imgRef = useRef();

  // useEffect(() => {
  //   //to fetch desk list for edit desks
  //   if (props.id) {
  //     console.log("in edit");
  //     const getData = async () => {
  //       await getSpaceAndDeskData(props.id).then((data) => {
  //         // setIsLoading(false);
  //         // setDataSource(data);
  //         console.log(data);
  //         setSpaceName(data.name);
  //         setInitialDeskNumber(data.startingDesk);
  //         setDeskList(data.desks);
  //         if (!data.defaultImage) setImage(data.image);
  //       });
  //     };
  //     getData();
  //   }
  // }, []);

  const values = {
    spaceName,
    setSpaceName,
    deskList,
    setDeskList,
    initialDeskList,
    setInitialDeskList,
    deskId,
    setDeskId,
    initialDeskNumber,
    setInitialDeskNumber,
    image,
    setImage,
    isDefaultImage,
    setIsDefaultImage,
    deskRef,
  };
  return (
    <>
      <LayoutConfigContext.Provider value={values}>
        <ConfigureLayoutSettings
          name={props.id ? "Modify Space" : "Add Space"}
          id={props.id}
        ></ConfigureLayoutSettings>
      </LayoutConfigContext.Provider>
    </>
  );
};

export default AddSpaces;
