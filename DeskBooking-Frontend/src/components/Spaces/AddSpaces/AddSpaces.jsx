import React, { useRef, useState, useEffect } from "react";
import ConfigureLayoutSettings from "../AdminConfigLayout/ConfigureLayoutSettings";
import { LayoutConfigContext } from "../../../helpers/contexts/AdminLayoutConfigContext";
import RoomImage from "../../../assets/images/empty-grid.jpg";
import axios from "axios";

const AddSpaces = (props) => {
  useEffect(() => {
    //to fetch desk list in manage desks
  }, []);

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
  const [deskList, setDeskList] = useState([
    // {
    //   id: 1,
    //   x: 700.9661705006765,
    //   y: 976.1921515561569,
    // },
    // {
    //   id: 2,
    //   x: 890.1840324763193,
    //   y: 597.7564276048714,
    // },
    // {
    //   id: 31,
    //   x: 1156.8092016238159,
    //   y: 838.5791610284167,
    // },
  ]);

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

  const values = {
    deskList,
    setDeskList,
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
