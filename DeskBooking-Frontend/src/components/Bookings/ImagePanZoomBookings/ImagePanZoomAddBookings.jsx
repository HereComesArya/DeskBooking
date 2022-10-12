import React, { useState, useEffect, useRef, useContext } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { BookingsConfigContext } from "../../../helpers/contexts/AddBookingsLayoutConfig";
import useClickPreventionOnDoubleClick from "../../../helpers/hooks/UseClickPreventionOnDoubleClick";

import "./ImagePanZoomAddBookings.css";
import "antd/dist/antd.css";
import { CaretLeftFilled } from "@ant-design/icons";

const ImagePanZoomFunction = () => {
  const {
    image,
    setImage,
    spaceName,
    setSpaceName,
    selectedSpaceId,
    setSelectedSpaceId,
    deskList,
    setDeskList,
    selectedDeskId,
    setSelectedDeskId,
    initialDeskNumber,
    setInitialDeskNumber,
    updateViewer,
    setUpdateViewer,
  } = useContext(BookingsConfigContext);

  /* Ref for starting Desk Number */
  const initialDeskNumberRef = useRef(1);

  const [previousSelectedNode, setPreviousSelectedNode] = useState(null);

  /* Ref for new desk svg*/
  const imgRef = useRef();

  useEffect(() => {
    initialDeskNumberRef.current = initialDeskNumber;
    // changeTitles(imgRef.current.parentNode.lastChild, true);
  }, [initialDeskNumber]);

  /* For viewer */
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);

  /* Set svg Width and Height. Triggers on window resize */
  // const [width, setWidth] = React.useState(window.innerWidth / 1.216);
  // const [height, setHeight] = React.useState(window.innerHeight / 1.2);
  const [width, setWidth] = React.useState(400);
  const [height, setHeight] = React.useState(400);

  const [reload, reloadNow] = useState("");

  // /*image inside viewer*/
  // const [image, setImage] = useState(RoomImage); //copied

  // const [deskList, setDeskList] = useState([]);
  // const [id, setId] = useState(1);
  // //copied
  // //copied

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

  //todo check
  useEffect(() => {
    console.log(deskList);
  }, [deskList]);

  useEffect(() => {
    // console.log(imgRef.current.parentNode.lastChild);
    // EmptyViewer(imgRef.current.parentNode.lastChild, true);
    renderCircles(deskList);
    // setDeskName(initialDeskNumber);
    // reloadNow((prev) => !prev);
  }, [updateViewer]);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth / 1);
    setHeight(window.innerHeight / 2);
    console.log("width, height update");
  };

  var Viewer = null;

  useEffect(() => {
    //fitToViewer
    Viewer.fitToViewer();
  }, [Viewer]);

  // todo check
  const executeAction = async (e) => {
    if (previousSelectedNode) {
      previousSelectedNode.target.style.fill = "green";
    }
    e.target.style.fill = "pink";
    setPreviousSelectedNode(e);
    // console.log("delete node id", e.target.id); //gives id of node
    console.log(e);

    // setTimeout(removeCircle(e), 100);
    // console.log("after rem circles");
  };

  // const removeCircle = (e) => {
  //   console.log("in removeCircle");
  //   const neDeskList = deskRef.current.filter((desk) => desk.id != e.target.id);
  //   setDeskList(neDeskList);
  //   // console.log(imgRef.current.parentNode.lastChild);
  //   // console.log(imgRef.current);
  //   changeTitles(e.target, false);
  //   e.target.remove();
  //   initialDeskNumberRef.current--;
  // };

  // todo check
  // // ? what???
  //!!remove all circles
  const EmptyViewer = (element, fromEffect) => {
    if (element.localName === "circle") {
      let sibling = fromEffect ? element : element.previousSibling;
      while (sibling.localName === "circle") {
        sibling.remove();
        sibling = sibling.previousSibling;
      }
    }
  };

  //change colours
  // const changeTitles = (element, fromEffect) => {
  //   if (element.localName === "circle") {
  //     let newDeskName = fromEffect
  //       ? initialDeskNumber
  //       : parseInt(element.innerHTML.slice(8, -8));
  //     let sibling = fromEffect ? element : element.previousSibling;
  //     while (sibling.localName === "circle") {
  //       sibling.innerHTML = `<title>D${newDeskName}</title>`;
  //       sibling = sibling.previousSibling;
  //       newDeskName++;
  //       fromEffect && initialDeskNumberRef.current++;
  //     }
  //   }
  // };

  const renderCircles = (desks) => {
    console.log("In render circles function");
    console.log(desks);
    let svgns = "http://www.w3.org/2000/svg";
    const node = imgRef.current;
    desks.forEach((desk, index) => {
      // const svg = document.createElementNS(svgns, "svg");
      // svg.setAttributeNS(null, "overflow", visible);

      /* Create an svg element for each node.
        Add a circle and text element.

      */

      const circle = document.createElementNS(svgns, "circle");

      circle.setAttributeNS(null, "key", index);
      circle.setAttributeNS(null, "id", desk.id);
      circle.setAttributeNS(null, "cx", desk.x);
      circle.setAttributeNS(null, "cy", desk.y);
      circle.setAttributeNS(null, "r", 30);
      if (desk.isAvailable) {
        circle.setAttributeNS(null, "fill", "green");
        circle.addEventListener("click", executeAction);
      } else {
        circle.setAttributeNS(null, "fill", "gray");
      }
      circle.setAttributeNS(null, "stroke", "black");

      const title = document.createElementNS(svgns, "title");
      title.innerHTML = `D${initialDeskNumberRef.current}`;

      // const text = document.createElementNS(svgns, "text");
      // text.innerHTML = `D${deskName}`;
      // text.setAttributeNS(null, "x", desk.x);
      // text.setAttributeNS(null, "y", desk.y);
      // text.setAttributeNS(null, "font-size", "100");
      // // var textNode = document.createTextNode("val");

      // setDeskName((prev) => prev + 1);
      initialDeskNumberRef.current += 1;

      // console.log("deskname ", deskName);
      // newElement.innerHTML = `Desk #${desk.name}`;

      circle.appendChild(title);
      // text.appendChild(textNode);
      // svg.appendChild(circle);
      // svg.appendChild(text);
      // node.after(svg);

      node.after(circle);

      console.log("Created a circle");
    });
  };
  // todo check up

  return (
    <>
      {/* <p>initialDeskNumberRef: {initialDeskNumberRef.current}</p>
      <p>initialDeskNumber: {initialDeskNumber}</p> */}
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
              background="#616264"
              detectAutoPan={false}
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
      </div>
    </>
  );
};

export default ImagePanZoomFunction;
