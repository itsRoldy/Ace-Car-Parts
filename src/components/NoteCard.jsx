// // sortedNotes is not being passed back into NoteCard during the mouseMove and mouseUp

// import React, { useRef, useState } from "react";
// import { setNewOffset, setZIndex, snapToGrid } from "../utils";
// import { GLOBAL_SIZE } from "../assets/fakeData";
// import infoIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/circle-info-solid.svg";

// export const gridSize = 25 // Grid size for snapping

// const NoteCard = ({ note, onContextMenu, allNotes, onPositionChange, onDragStart, onDragEnd, onPanningStateChange, isSelected }) => {
//   const body = JSON.parse(note.body);
//   const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
//   const noteData = note.noteData ? JSON.parse(note.noteData) : [];
//   const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
//   const cardRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false); // Track hover state
//   const [isDragging, setIsDragging] = useState(false); // Track dragging state
//   //const [isPanningDisabled, setIsPanningDisabled] = useState(false);

//   let mouseStartPos = { x: 0, y: 0 };

//   const handleMouseDown = (e) => {
//     setIsDragging(true);
//     onPanningStateChange(true)
//     mouseStartPos.x = e.clientX;
//     mouseStartPos.y = e.clientY;
//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);

//     setZIndex(cardRef.current);
//   };

//   const handleMouseMove = (e) => {
//     const mouseMoveDir = {
//       x: mouseStartPos.x - e.clientX,
//       y: mouseStartPos.y - e.clientY,
//     };

//     mouseStartPos.x = e.clientX;
//     mouseStartPos.y = e.clientY;

//     const newPosition = setNewOffset(cardRef.current, mouseMoveDir, padding);
//     setPosition(newPosition);
//     onPositionChange({ ...note, position: newPosition })
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     onPanningStateChange(false)

//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);

//     snapToGrid(cardRef.current, padding, gridSize);
//   };

//   const handleInfoClick = () => {

//   }

//   const cursorStyle = isHovered || isDragging ? "pointer" : "auto";


//   return (
//     <div
//       ref={cardRef}
//       className="card"
//       style={{
//         backgroundColor: isSelected ? "rgba(0, 123, 255, 0.1)" : noteData.colorBody || "blue",
//         //backgroundColor: noteData.colorBody || "blue",
//         width: width,
//         height: height,
//         left: `${position.x}px`,
//         top: `${position.y}px`,
//         border: isSelected ? "2px solid #007bff" : isHovered ? "3px solid #FFD700" : "1px solid transparent",
//         //border: isHovered ? "3px solid #FFD700" : "1px solid transparent",
//         boxSizing: "border-box",
//         transition: "border 0.3s ease, background-color 0.3s ease",
//         //transition: "border 0.3s ease",
//         cursor: cursorStyle,
//         boxShadow: isHovered ? "0 0 10px rgba(255, 215, 0, 0.7)" : isSelected ? "0 0 10px rgba(0, 123, 255, 0.7)" : "none",
//         //boxShadow: isHovered ? "0 0 10px rgba(255, 215, 0, 0.7)" : "none",
//         transform: isHovered ? "scale(1.05)" : "scale(1)",
//         transformOrigin: "center",
//         zIndex: 10,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//       onDragStart={(e) => onDragStart(note)} // Trigger the drag start handler
//       onDragEnd={onDragEnd} // Trigger the drag end handler
//       //onContextMenu={(e) => onContextMenu(e, note)}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onMouseDown={handleMouseDown}
//     >
//       <img
//         src={infoIcon}
//         alt="Info"
//         style={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           cursor: "pointer",
//           width: 20,
//           height: 20,
//         }}
//         onClick={handleInfoClick}
//       />
//       <textarea
//         style={{
//           pointerEvents: "none",
//           color: noteData.colorText,
//           fontWeight: "bold",
//           fontSize: 18,
//           //cursor: "text", 
//           textAlign: "center",
//           verticalAlign: "middle",
//           border: "none",
//           backgroundColor: "transparent",
//           resize: "none",
//           cursor: cursorStyle,
//           width: "auto",
//           height: "auto",
//           padding: 0,
//           margin: 0,
//           display: "block",
//           lineHeight: `${height}px`,
//         }}
//         defaultValue={body}
//         onFocus={() => {
//           setZIndex(cardRef.current)
//         }}
//       ></textarea>
//     </div>
//   );
// };

// export default NoteCard;

//////////////////////////////////



import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { setNewOffset, setZIndex, snapToGrid } from "../utils";
import { GLOBAL_SIZE } from "../assets/fakeData";
import infoIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/circle-info-solid.svg";
import ContextMenu from "../components/contextMenus.jsx";

export const gridSize = 25;

const NoteCard = ({ note, allNotes, onPositionChange, onPanningStateChange, isSelected,  }) => {
  const body = JSON.parse(note.body);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
  const noteData = note.noteData ? JSON.parse(note.noteData) : [];
  const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const infoIconRef = useRef(null)

  let mouseStartPos = { x: 0, y: 0 };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [contextMenu, infoPopup])

  const handleClickOutside = (e) => {
    const menu = document.getElementById("conetext-menu")
    if (menu && menu.contains(e.target)) {
      return
    }
    e.preventDefault()
    //setContextMenu(null)
  }

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      note,
    })
  }


  const handleMouseDown = (e) => {
    if (e.button === 2) {    // Right-click
      return;
    } 

    setContextMenu(null)
    setIsDragging(true);
    onPanningStateChange(true);

    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    setZIndex(cardRef.current);
  };

  const handleMouseMove = (e) => {
    const mouseMoveDir = {
      x: mouseStartPos.x - e.clientX,
      y: mouseStartPos.y - e.clientY,
    };
    mouseStartPos.x = e.clientX;
    mouseStartPos.y = e.clientY;
    const newPosition = setNewOffset(cardRef.current, mouseMoveDir, padding);
    setPosition(newPosition);
    onPositionChange({ ...note, position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onPanningStateChange(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    snapToGrid(cardRef.current, padding, gridSize);
  };

  const handleInfoClick = () => {
    openInfoPopup()
  }

  const openInfoPopup = () => {
    setInfoPopup(null);

    setTimeout(() => {
      const vehicleInfo = JSON.parse(note.noteData).vehicleInfo || {};
      setInfoPopup({
        x: parseFloat(width) + 25,
        y: 0,
        note: { title: JSON.parse(note.body) },
        info: {
          VIN: vehicleInfo.VIN || "N/A",
          motorType: vehicleInfo.motorType || "Unknown",
          mileage: vehicleInfo.mileage || "N/A",
          partsUnavail: vehicleInfo.partsUnavail || [],
        },
      });

      setContextMenu(null)
    }, 10);
  };

  const handleOptionSelect = (action) => {
    if (action === "getInfo") {
      openInfoPopup()
    }

    setTimeout(() => {
      setContextMenu(null)
    }, 10)
  };

  // const handleInfoClick = (e) => {
  //   e.stopPropagation()

  //   setInfoPopup(null)

  //   setTimeout(() => {
  //     //if (cardRef.current) {

  //       const vehicleInfo = JSON.parse(note.noteData).vehicleInfo

  //       const rect = cardRef.current.getBoundingClientRect()
  //       const parentRect = cardRef.current.offsetParent.getBoundingClientRect()
  //       console.log(vehicleInfo)

  //       setInfoPopup({
  //         x: parseFloat(width) + 25, // Place the info popup 25px to the right of the right side of the note
  //         y: 0,
  //         note: { title: JSON.parse(note.body) },
  //         info: {
  //           VIN: vehicleInfo.VIN || "N/A",
  //           notorType: vehicleInfo.motorType || "Unknow",
  //           mileage: vehicleInfo.mileage || "N/A",
  //           partsUnavail: vehicleInfo.partsUnavail || [],
  //         }
  //       })
  //     //}
  //   }, 50)
  // }


  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: isSelected ? "rgba(0, 123, 255, 0.1)" : noteData.colorBody || "blue",
        width: width,
        height: height,
        left: position.x,
        top: position.y,
        border: isSelected ? "2px solid #007bff" : isHovered && !infoPopup ? "3px solid #FFD700" : "1px solid transparent",
        boxSizing: "border-box",
        transition: "border 0.3s ease, background-color 0.3s ease",
        cursor: isHovered || isDragging ? "pointer" : "auto",
        boxShadow: isHovered && !infoPopup ? "0 0 10px rgba(255, 215, 0, 0.7)" : isSelected ? "0 0 10px rgba(0, 123, 255, 0.7)" : "none",
        transform: isHovered && !infoPopup ? "scale(1.05)" : "scale(1)",
        transformOrigin: "center",
        zIndex: isDragging ? 1000 : 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}

      onMouseEnter={() => {
        if (!infoPopup) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => {
        if (!infoPopup) {
          setIsHovered(false);
        }
      }}

      onMouseDown={() => {
        setInfoPopup(null)}
      }
      onContextMenu={handleContextMenu}
    >
      <img
        ref={infoIconRef}
        src={infoIcon}
        alt="Info"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          cursor: "pointer",
          width: 20,
          height: 20
        }}
        onClick={handleInfoClick}
      />
      <textarea
        style={{
          pointerEvents: "none",
          color: noteData.colorText,
          fontWeight: "bold",
          fontSize: 18,
          textAlign: "center",
          verticalAlign: "middle",
          border: "none",
          backgroundColor: "transparent",
          resize: "none",
          cursor: "pointer",
          width: "auto",
          height: "auto",
          padding: 0,
          margin: 0,
          display: "block",
          lineHeight: `${height}px`,
        }}
        defaultValue={body}
      ></textarea>

      {contextMenu && 
        ReactDOM.createPortal(
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            type="note"
            onOptionSelect={handleOptionSelect}
            note={contextMenu.note}
            style={{
              position: "fixed",
              left: '${contextMenu.x}px',
              top: '${contextMenu.y}px',
              zIndex: 9999,
              //transform: `translate(${contextMenu.x}px, ${contextMenu.y}px)`
            }}
          />,
          document.body
        )}

      {infoPopup && (
        <div
          className="info-popup"
          style={{
            position: "absolute",
            left: infoPopup.x,
            top: infoPopup.y,
            padding: "10px",
            backgroundColor: "#2E2E2E",
            color: "#FFFFFF",
            border: "1px solid #444",
            borderRadius: "5px",
            zIndex: 1001,
            display: "inline-block",
            maxWidth: "400px",
            minWidth: "200px",
            wordWrap: "break-word",
            cursor: "pointer",
            overflow: "visible",
          }}
          //onMouseDown={(e) => e.stopPropagation()}
        >
          <h3>{infoPopup.note.title}</h3>
          <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
          <p><strong>Motor Type:</strong> {infoPopup.info.motorType}</p>
          <p><strong>Mileage:</strong> {infoPopup.info.mileage}</p>

          <div>
            <strong>Parts Unavailable:</strong>
            <select
              defaultValue=""
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              style={{
                maxHeight: "50px",
                width: "100%",
                overflowY: "auto",
                zIndex: 1002
              }}
            >
              <option value="" disabled>Click to view</option>
              {infoPopup.info.partsUnavail.map((part, index) => (
                <option key={index} value={part.value}>
                  {part.label}
                </option>
              ))}
            </select>
          </div>

          <button
            className="info-popup"
            style={{
              left: infoPopup.x,
              top: infoPopup.y,
              marginTop: "10px",
              padding: "5px",
              backgroundColor: "#444",
              color: "#FFF",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer"
            }}
            onClick={() => setInfoPopup(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NoteCard;
