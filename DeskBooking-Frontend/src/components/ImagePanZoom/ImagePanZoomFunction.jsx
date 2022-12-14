import React, { useState, useEffect, useRef, useContext } from "react";
import { useWindowSize } from "@react-hook/window-size";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { LayoutConfigContext } from "../../helpers/contexts/AdminLayoutConfigContext";
import useClickPreventionOnDoubleClick from "../../helpers/hooks/UseClickPreventionOnDoubleClick";

import "./ImagePanZoomFunction.css";
import "antd/dist/antd.css";
import { CaretLeftFilled } from "@ant-design/icons";

const ImagePanZoomFunction = () => {
  const {
    deskList,
    setDeskList,
    initialDeskList,
    setInitialDeskList,
    deskId,
    setDeskId,
    image,
    setImage,
    initialDeskNumber,
    setInitialDeskNumber,
    deskRef,
  } = useContext(LayoutConfigContext);

  /* Ref for starting Desk Number */ //copied
  const initialDeskNumberRef = useRef();

  /* Ref for new desk svg*/
  const imgRef = useRef();

  useEffect(() => {
    initialDeskNumberRef.current = initialDeskNumber;
    changeTitles(imgRef.current.parentNode.lastChild, true);
  }, [initialDeskNumber]);

  // useEffect(() => {
  //   console.log(initialDeskNumberRef.current);
  // }, [deskName]);

  /* For viewer */
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);

  /* Set svg Width and Height. Triggers on window resize */
  const [width, setWidth] = useState(window.innerWidth / 1.5);
  // const [height, setHeight] = useState(window.innerHeight / 2);
  const [height, setHeight] = useState(window.innerWidth / 1.8);

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

  // /* Ref for deskList*/
  // const deskRef = useRef([]);
  // deskRef.current = deskList;
  // //copied

  // useEffect(
  //   () => {
  //     window.addEventListener("resize", updateWidthAndHeight);
  //     // Viewer.fitToViewer();
  //     // console.log(window.innerWidth, window.innerHeight);
  //     // console.log(deskRef);
  //     return () => window.removeEventListener("resize", updateWidthAndHeight);
  //   }
  //   // [Viewer]
  //   // [window.innerWidth, window.innerHeight]
  // ),
  //   [];

  useEffect(() => {
    console.log(deskRef.current);
  }, [deskList]);

  useEffect(() => {
    renderCircles(deskList);
    console.log(deskRef.current);
    if (deskList.length > 0) {
      setDeskId(deskList.slice(-1)[0].id + 1);
    } else {
      setDeskId(1);
    }
  }, []);

  useEffect(() => {
    renderCircles(deskList);
    console.log(deskRef.current);
    if (deskList.length > 0) {
      setDeskId(deskList.slice(-1)[0].id + 1);
    } else {
      setDeskId(1);
    }
  }, [initialDeskList]);

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

  const addDesks = (x, y) => {
    const desk = {
      id: deskId,
      x: x,
      y: y,
    };
    setDeskId((prev) => prev + 1);

    const newDeskList = [...deskList, desk];
    setDeskList(newDeskList);
    renderCircles([desk]);
  };

  const executeAction = (e) => {
    // e.target.style.fill = "black";
    // console.log("delete node id", e.target.id); //gives id of node
    // console.log(e);
    setTimeout(removeCircle(e), 100);
    // console.log("after rem circles");
  };

  const removeCircle = (e) => {
    console.log("in removeCircle");
    const newDeskList = deskRef.current.filter(
      (desk) => desk.id != e.target.id
    );
    setDeskList(newDeskList);
    // console.log(imgRef.current.parentNode.lastChild);
    // console.log(imgRef.current);
    changeTitles(e.target, false);
    e.target.remove();
    initialDeskNumberRef.current--;
  };

  const changeTitles = (element, fromEffect) => {
    if (element.localName === "circle") {
      let newDeskName = fromEffect
        ? initialDeskNumber
        : parseInt(element.innerHTML.slice(8, -8));
      let sibling = fromEffect ? element : element.previousSibling;
      while (sibling.localName === "circle") {
        sibling.innerHTML = `<title>D${newDeskName}</title>`;
        sibling = sibling.previousSibling;
        newDeskName++;
        fromEffect && initialDeskNumberRef.current++;
      }
    }
  };

  const renderCircles = (desks) => {
    console.log("In render circles function");

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
      circle.setAttributeNS(null, "fill", "red");
      circle.setAttributeNS(null, "stroke", "black");
      circle.addEventListener("dblclick", executeAction);

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

  const singleClick = (event) => {
    // console.log(event);
    if (event.originalEvent.detail === 1) {
      // console.log("singleClick ran");
      // console.log("coordinates clicked = " + event.x, event.y);
      addDesks(event.x, event.y);
      // console.log("clicked ", event.originalEvent.detail, " times");
    }
  };

  const doubleClick = () => {
    {
    }
  };

  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
    singleClick,
    doubleClick
  );

  return (
    <>
      {/* <p>initialDeskNumberRef: {initialDeskNumberRef.current}</p>
      <p>initialDeskNumber: {initialDeskNumber}</p>
      <p>deskId: {deskId}</p> */}
      <div className="container">
        <div
          className="item"
          style={{ display: "flex", justifyContent: "center" }}
        >
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
              onClick={(e) => handleClick(e)}
              onDoubleClick={handleDoubleClick}
              // onClick={(e) => console.log(e.originalEvent.detail)}
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
