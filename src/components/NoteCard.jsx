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

const NoteCard = ({ note, allNotes, onPositionChange, onPanningStateChange, closeContextMenu, isSelected, setGlobalContextMenu, isPanning }) => {
  const body = JSON.parse(note.body);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
  const noteData = note.noteData ? JSON.parse(note.noteData) : [];
  const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [isInfoPopupVisible, setIsInfoPopupVisible] = useState(false)

  let mouseStartPos = { x: 0, y: 0 };

  useEffect(() => {
    // Close context menu when clicking anywhere outside current note
    const handleClickOutside = (e) => {
      if (!isPanning && contextMenu && !cardRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [contextMenu, isPanning]);

   const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      //absoluteX: e.clientX,
      //absoluteY: e.clientY,
      //note
    })
  }

  const handleMouseDown = (e) => {
    if (e.button === 2) { // Right-click
      return;
    } else {
      setContextMenu(null)
    }

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

  const handleOptionSelect = (action) => {
    if (action === "deleteNote") {
      // Handle note deletion here
    } else if (action === "copyNote") {
      // Handle note copying here
    }
    setContextMenu(null);
  };

  const handleInfoClick = () => {
    setIsInfoPopupVisible(true)
  }

  const handleCloseInfoPopup = () => {
    setIsInfoPopupVisible(false)
  }

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
        border: isSelected ? "2px solid #007bff" : isHovered ? "3px solid #FFD700" : "1px solid transparent",
        boxSizing: "border-box",
        transition: "border 0.3s ease, background-color 0.3s ease",
        cursor: isHovered || isDragging ? "pointer" : "auto",
        boxShadow: isHovered ? "0 0 10px rgba(255, 215, 0, 0.7)" : isSelected ? "0 0 10px rgba(0, 123, 255, 0.7)" : "none",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transformOrigin: "center",
        zIndex: isDragging ? 1000 : 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
    >
      <img
        src={infoIcon}
        alt="Info"
        style={{ position: "absolute", top: 0, right: 0, cursor: "pointer", width: 20, height: 20 }}
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
          onOptionSelect={(action) => handleOptionSelect(action)}
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

      {isInfoPopupVisible &&
        ReactDOM.createPortal(
          <div
            style={{
              position: "fixed",
              left: note.position.x + 250,
              top: note.position.y + 20,
              //top: "50%",
              //left: "50%",
              padding: "10px",
              backgroundColor: "#2E2E2E",
              color: "#FFFFFF",
              border: "1px solid #444",
              borderRadius: "5px",
              zIndex: 1010,
              display: "inline-block",
              maxWidth: "400px",
              minWidth: "200px",
              wordWrap: "break-word",
              cursor: "pointer", // Indicate that it's draggable
              overflow: "visible",
            }}
          >
            <h2>Note Information</h2>
            <p>{body}</p>
            <button onClick={handleCloseInfoPopup}>Close</button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NoteCard;
