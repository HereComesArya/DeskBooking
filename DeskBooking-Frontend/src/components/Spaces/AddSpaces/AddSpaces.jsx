import React, { useRef, useState, useEffect } from "react";
import ConfigureLayoutSettings from "../AdminConfigLayout/ConfigureLayoutSettings";
import { LayoutConfigContext } from "../../../helpers/contexts/AdminLayoutConfigContext";
import RoomImage from "../../../assets/images/empty-grid.jpg";

const AddSpaces = () => {
  useEffect(() => {
    //to fetch desk list in manage desks
  }, []);

  /*Name of the new space*/
  const [spaceName, setSpaceName] = useState("");

  /*Test isAdmin, supposed to be in auth context*/

  /*Image inside viewer*/
  const [image, setImage] = useState(RoomImage);

  //holds the id of the last desk, equal to length of desklist
  const [id, setId] = useState(1);

  //Name of the desk provided by ADMIN
  const [deskName, setDeskName] = useState("");

  //List of desks(id, name, x, y)
  const [deskList, setDeskList] = useState([
    // {
    //   id: 1,
    //   name: "",
    //   x: 700.9661705006765,
    //   y: 976.1921515561569,
    // },
    // {
    //   id: 2,
    //   name: "",
    //   x: 890.1840324763193,
    //   y: 597.7564276048714,
    // },
    // {
    //   id: 3,
    //   name: "",
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

  const [isAdding, setIsAdding] = useState(true); //change to false later
  const [isDeleting, setIsDeleting] = useState(false);

  const addRef = useRef(true); //change to false later
  const deleteRef = useRef(true);
  deleteRef.current = isDeleting;
  addRef.current = isAdding;

  /* Ref for embedded image*/
  const imgRef = useRef();

  // setDeskList([
  //   {
  //     id: 1,
  //     name: "",
  //     x: 700.9661705006765,
  //     y: 976.1921515561569,
  //   },
  //   {
  //     id: 2,
  //     name: "",
  //     x: 890.1840324763193,
  //     y: 597.7564276048714,
  //   },
  //   {
  //     id: 3,
  //     name: "",
  //     x: 1156.8092016238159,
  //     y: 838.5791610284167,
  //   },
  // ]);

  const values = {
    spaceName,
    setSpaceName,
    deskList,
    setDeskList,
    id,
    setId,
    isAdding,
    setIsAdding,
    isDeleting,
    setIsDeleting,
    image,
    setImage,
    deskName,
    setDeskName,
    addRef,
    deleteRef,
    // imgRef,
    deskRef,
  };
  return (
    <>
      <LayoutConfigContext.Provider value={values}>
        <ConfigureLayoutSettings></ConfigureLayoutSettings>
      </LayoutConfigContext.Provider>
    </>
  );
};

export default AddSpaces;
