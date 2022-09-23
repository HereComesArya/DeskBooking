import React, { useState, useEffect, useRef, useContext } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { LayoutConfigContext } from "../../helpers/contexts/AdminLayoutConfigContext";
import { List } from "antd";

import "./ImagePanZoomFunction.css";
import "antd/dist/antd.css";
import { CaretLeftFilled } from "@ant-design/icons";

const ImagePanZoomFunction = () => {
  const {
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
  } = useContext(LayoutConfigContext);

  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);

  /* Set svg Width and Height. Triggers on window resize */
  const [width, setWidth] = React.useState(window.innerWidth / 2);
  const [height, setHeight] = React.useState(window.innerHeight / 2);

  // /*image inside viewer*/
  // const [image, setImage] = useState(RoomImage); //copied

  // const [deskList, setDeskList] = useState([]);
  // const [id, setId] = useState(1);
  // //copied

  // /* Set toggles for adding and deleting desks*/
  // const [isAdding, setIsAdding] = useState(true); //change to false later
  // const [isDeleting, setIsDeleting] = useState(false);
  // const addRef = useRef(true); //change to false later
  // const deleteRef = useRef(true);
  // deleteRef.current = isDeleting;
  // addRef.current = isAdding;
  // //copied

  // /* Ref for new desk svg*/
  const imgRef = useRef(); //copied

  // /* Ref for deskList*/
  // const deskRef = useRef([]);
  // deskRef.current = deskList;
  // //copied

  useEffect(
    () => {
      window.addEventListener("resize", updateWidthAndHeight);
      // Viewer.fitToViewer();
      // console.log(window.innerWidth, window.innerHeight);
      // console.log(deskRef);
      return () => window.removeEventListener("resize", updateWidthAndHeight);
    }
    // [Viewer]
    // [window.innerWidth, window.innerHeight]
  );

  useEffect(() => {
    console.log("object");
    console.log(deskRef.current);
  }, [deskList]);

  useEffect(() => {
    renderCircles(deskList);
  }, []);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight / 2);
  };

  var Viewer = null;

  useEffect(() => {
    //fitToViewer
    Viewer.fitToViewer();
  }, [Viewer]);

  const addDesks = (x, y) => {
    const desk = {
      id: id,
      name: "", //Name of the desk provided by ADMIN
      x: x,
      y: y,
    };
    setId((id) => id + 1);

    const newDeskList = [...deskList, desk];
    setDeskList(newDeskList);
    renderCircles([desk]);
  };

  const executeAction = (e) => {
    // e.target.style.fill = "black";
    console.log(e.target.id); //gives id of node
    console.log("del");
    if (deleteRef.current) {
      removeCircle(e);
    }
  };

  const removeCircle = (e) => {
    console.log("in removeCircle");
    e.target.remove();
    const neDeskList = deskRef.current.filter((desk) => desk.id != e.target.id);
    setDeskList(neDeskList);
  };

  const renderCircles = (desks) => {
    console.log("In render circles function");

    var svgns = "http://www.w3.org/2000/svg";
    const node = imgRef.current;
    desks.forEach((desk, index) => {
      const circle = document.createElementNS(svgns, "circle");

      circle.setAttributeNS(null, "key", index);
      circle.setAttributeNS(null, "id", desk.id);
      circle.setAttributeNS(null, "cx", desk.x);
      circle.setAttributeNS(null, "cy", desk.y);
      circle.setAttributeNS(null, "r", 30);
      circle.setAttributeNS(null, "fill", "red");
      circle.setAttributeNS(null, "stroke", "black");

      var newElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "title"
      );

      newElement.innerHTML = `Desk #${desk.id}`;
      circle.appendChild(newElement);

      circle.addEventListener("dblclick", executeAction);

      node.after(circle);

      console.log("Created a circle");
    });
  };

  const handleClick = (e) => {
    console.log(e);
    switch (e.detail) {
      case 1:
        return 1;
        break;
      case 2:
        console.log("double click");
        break;
      case 3:
        console.log("triple click");
        break;
    }
  };

  return (
    <>
      <div className="container">
        <div className="item">
          <div>
            {/* <div style={{ width: width, height: height }}> */}
            {/* <AutoSizer>
            {({ width, height }) => ( */}
            <ReactSVGPanZoom
              width={width}
              height={height}
              ref={(Viewer2) => (Viewer = Viewer2)}
              tool={tool}
              onChangeTool={(tool) => setTool(tool)}
              value={value}
              onChangeValue={(value) => setValue(value)}
              background="#FFF"
              detectAutoPan={false}
              onClick={(event) => {
                console.log("coordinates clicked = " + event.x, event.y);
                if (isAdding) addDesks(event.x, event.y);

                // console.log(event.originalEvent.detail);
                if (event.originalEvent.detail === 2) {
                  console.log("double click");
                } else {
                  console.log("single click");
                }
              }}
              miniatureProps={{
                position: "none",
              }}
            >
              <svg
                id="cont"
                xmlns="http://www.w3.org/2000/svg"
                width={1920}
                height={1589}
              >
                <image
                  overflow="visible"
                  width={1920}
                  height={1589}
                  href={image}
                  style={{
                    userSelect: "none",
                    MozUserSelect: "none",
                    WebkitUserSelect: "none",
                    MsUserSelect: "none",
                  }}
                  ref={imgRef}
                />
              </svg>
            </ReactSVGPanZoom>
            {/* )}
          </AutoSizer> */}
          </div>
        </div>
        {/* <List
          className="scroll"
          size="small"
          column={7}
          dataSource={deskList}
          renderItem={(desk, index) => (
            <List.Item
              key={index}
              actions={[
                <a
                  key={index}
                  onClick={() => {
                    // console.log(desk.id);
                    executeAction(desk);
                  }}
                >
                  Delete
                </a>,
              ]}
            >
              <List.Item.Meta
                title={<a href="https://ant.design">{desk.id}</a>}
              />
              <div>Content</div>
            </List.Item>
          )}
        /> */}
      </div>
    </>
  );
};

export default ImagePanZoomFunction;
