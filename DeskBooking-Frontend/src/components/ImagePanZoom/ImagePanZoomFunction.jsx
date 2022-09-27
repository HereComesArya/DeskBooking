import React, { useState, useEffect, useRef, useContext } from "react";
import { INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE } from "react-svg-pan-zoom";
import { LayoutConfigContext } from "../../helpers/contexts/AdminLayoutConfigContext";
import useClickPreventionOnDoubleClick from "../../helpers/hooks/UseClickPreventionOnDoubleClick";

import "./ImagePanZoomFunction.css";
import "antd/dist/antd.css";

const ImagePanZoomFunction = () => {
  const {
    deskList,
    setDeskList,
    id,
    setId,
    image,
    setImage,
    initialDeskNumber,
    setInitialDeskNumber,
    // imgRef,
    deskRef,
  } = useContext(LayoutConfigContext);

  const [deskName, setDeskName] = useState(1);
  useEffect(() => {
    setDeskName(initialDeskNumber);
    console.log(deskName);
  }, [initialDeskNumber]);

  /* For viewer */
  const [tool, setTool] = useState(TOOL_NONE);
  const [value, setValue] = useState(INITIAL_VALUE);

  /* Set svg Width and Height. Triggers on window resize */
  const [width, setWidth] = React.useState(window.innerWidth / 1.216);
  const [height, setHeight] = React.useState(window.innerHeight / 1.2);

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
    console.log(deskRef.current);
  }, [deskList]);

  useEffect(() => {
    renderCircles(deskList);
    // setDeskName(initialDeskNumber);
  }, []);

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth / 1);
    setHeight(window.innerHeight / 2);
    console.log("width, height update");
  };

  var Viewer = null;

  useEffect(() => {
    console.log("2");
    //clgs are test, fitToViewer is required
    Viewer.fitToViewer();
  }, [Viewer]);

  const addDesks = (x, y) => {
    const desk = {
      id: id,
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
    console.log("delete node id", e.target.id); //gives id of node
    console.log(e);
    setTimeout(removeCircle(e), 1000);
    console.log("after rem circles");
  };

  const removeCircle = (e) => {
    console.log("in removeCircle");
    e.target.remove();
    const neDeskList = deskRef.current.filter((desk) => desk.id != e.target.id);
    setDeskList(neDeskList);
  };

  const reRenderCircles = () => {
    //reset Id state
    // setDeskName(initialId);!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    //renderCircles with new desklist
  };

  const renderCircles = (desks) => {
    console.log("In render circles function");

    var svgns = "http://www.w3.org/2000/svg";
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

      var title = document.createElementNS(svgns, "title");
      title.innerHTML = `D${deskName}`;

      // const text = document.createElementNS(svgns, "text");
      // text.innerHTML = `D${deskName}`;
      // text.setAttributeNS(null, "x", desk.x);
      // text.setAttributeNS(null, "y", desk.y);
      // text.setAttributeNS(null, "font-size", "100");
      // // var textNode = document.createTextNode("val");

      setDeskName((prev) => prev + 1);

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
      console.log("singleClick ran");
      console.log("coordinates clicked = " + event.x, event.y);
      addDesks(event.x, event.y);
      console.log("clicked ", event.originalEvent.detail, " times");
    }
  };

  const doubleClick = () => {
    {
      console.log("doubleClick ran");
    }
  };

  const [handleClick, handleDoubleClick] = useClickPreventionOnDoubleClick(
    singleClick,
    doubleClick
  );

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
