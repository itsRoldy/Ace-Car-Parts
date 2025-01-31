
// // sortedNotes is not being passed back into NoteCard during the mouseMove and mouseUp

// import React, { useRef, useState } from "react";
// import { setNewOffset, setZIndex, snapToGrid } from "../utils";
// import { GLOBAL_SIZE } from "../assets/fakeData";

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
//       onContextMenu={(e) => onContextMenu(e, note)}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onMouseDown={handleMouseDown}
//     >
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




// sortedNotes is not being passed back into NoteCard during the mouseMove and mouseUp

import React, { useRef, useState } from "react";
import { setNewOffset, setZIndex, snapToGrid } from "../utils";
import { GLOBAL_SIZE } from "../assets/fakeData";

export const gridSize = 25 // Grid size for snapping

const NoteCard = ({ note, onContextMenu, allNotes, onPositionChange, onDragStart, onDragEnd, onPanningStateChange, isSelected }) => {
  const body = JSON.parse(note.body);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
  const noteData = note.noteData ? JSON.parse(note.noteData) : [];
  const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  //const [isPanningDisabled, setIsPanningDisabled] = useState(false);

  let mouseStartPos = { x: 0, y: 0 };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    onPanningStateChange(true)
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
    onPositionChange({ ...note, position: newPosition })

  };

  const handleMouseUp = () => {
    setIsDragging(false);
    onPanningStateChange(false)

    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);

    snapToGrid(cardRef.current, padding, gridSize);

  };

  const cursorStyle = isHovered || isDragging ? "pointer" : "auto";


  return (
    <div
      ref={cardRef}
      className="card"
      style={{
        backgroundColor: isSelected ? "rgba(0, 123, 255, 0.1)" : noteData.colorBody || "blue",
        //backgroundColor: noteData.colorBody || "blue",
        width: width,
        height: height,
        left: `${position.x}px`,
        top: `${position.y}px`,
        border: isSelected ? "2px solid #007bff" : isHovered ? "3px solid #FFD700" : "1px solid transparent",
        //border: isHovered ? "3px solid #FFD700" : "1px solid transparent",
        boxSizing: "border-box",
        transition: "border 0.3s ease, background-color 0.3s ease",
        //transition: "border 0.3s ease",
        cursor: cursorStyle,
        boxShadow: isHovered ? "0 0 10px rgba(255, 215, 0, 0.7)" : isSelected ? "0 0 10px rgba(0, 123, 255, 0.7)" : "none",
        //boxShadow: isHovered ? "0 0 10px rgba(255, 215, 0, 0.7)" : "none",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        transformOrigin: "center",
        zIndex: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onDragStart={(e) => onDragStart(note)} // Trigger the drag start handler
      onDragEnd={onDragEnd} // Trigger the drag end handler
      //onContextMenu={(e) => onContextMenu(e, note)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
    >
      <textarea
        style={{
          pointerEvents: "none",
          color: noteData.colorText,
          fontWeight: "bold",
          fontSize: 18,
          //cursor: "text", 
          textAlign: "center",
          verticalAlign: "middle",
          border: "none",
          backgroundColor: "transparent",
          resize: "none",
          cursor: cursorStyle,
          width: "auto",
          height: "auto",
          padding: 0,
          margin: 0,
          display: "block",
          lineHeight: `${height}px`,
        }}
        defaultValue={body}
        onFocus={() => {
          setZIndex(cardRef.current)
        }}
      ></textarea>
    </div>
  );
};

export default NoteCard;



