
// import React, { useEffect, useRef, useState } from "react";
// import ReactDOM from "react-dom";
// import { setNewOffset, setZIndex, snapToGrid } from "../utils";
// import { GLOBAL_SIZE } from "../assets/fakeData";
// import infoIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/circle-info-solid.svg";
// import ContextMenu from "../components/contextMenus.jsx";

// export const gridSize = 25;

// const NoteCard = ({ note, allNotes, onPositionChange, onPanningStateChange, isSelected, infoPopup, setInfoPopup, setContextMenu, contextMenu, transform, }) => {
//   const body = JSON.parse(note.body);
//   const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
//   const noteData = note.noteData ? JSON.parse(note.noteData) : [];
//   const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
//   const cardRef = useRef(null);
//   const [isHovered, setIsHovered] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false)
//   const infoIconRef = useRef(null)

//   let mouseStartPos = { x: 0, y: 0 };

//   useEffect(() => {

//     const handleClick = (e) => {
//       handleClickOutside(e)
//     }

//     if (contextMenu) {
//       console.log("Adding event listener for outside click.");
//       setTimeout(() => {
//         document.addEventListener("mousedown", handleClick);
//       }, 10); // Ensure the menu is rendered first
//     }
  
//     return () => {
//       if (contextMenu) {
//         console.log("Removing event listener for outside click.");
//         document.removeEventListener("mousedown", handleClick);
//       }
//     };
//   }, [contextMenu]);

//   const handleClickOutside = (e) => {
//     setTimeout(() => {
//       const menu = document.getElementById('context-menu')
//       console.log("checking menu:", menu, "clicked target:", e.target)

//       if (!menu) {
//         console.log("Menu does not exist at time of click")
//         return
//       }

//       if (menu.contains(e.target)) {
//         console.log("Click inside menu detected")
//         return
//       }

//       console.log("click outside menu detected")

//     }, 50);

//   }

//   const handleContextMenu = (e) => {
//     console.log("context menu set")
//     e.preventDefault();

//     if (contextMenu && contextMenu.note.$id === note.$id) {
//       return
//     }

//     setContextMenu({
//       x: e.clientX,
//       y: e.clientY,
//       note,
//     })

//   }

//   const handleMouseMove = (e) => {
//     const mouseMoveDir = {
//       x: mouseStartPos.x - e.clientX,
//       y: mouseStartPos.y - e.clientY,
//     };
//     mouseStartPos.x = e.clientX;
//     mouseStartPos.y = e.clientY;
//     const newPosition = setNewOffset(cardRef.current, mouseMoveDir, padding);
//     setPosition(newPosition);
//     onPositionChange({ ...note, position: newPosition });
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//     onPanningStateChange(false);
//     document.removeEventListener("mousemove", handleMouseMove);
//     document.removeEventListener("mouseup", handleMouseUp);
//     snapToGrid(cardRef.current, padding, gridSize);
//   };

//   const handleInfoClick = () => {
//     setInfoPopup(null)
    
//     setTimeout(() => {
//       openInfoPopup()
//     }, 10);
//   }

//   const openInfoPopup = () => {
//     console.log('info popup opened')

//     setTimeout(() => {
//       setContextMenu(null)
//     }, 50);

//     setInfoPopup(null)
    
//     setTimeout(() => {
//       const vehicleInfo = JSON.parse(note.noteData).vehicleInfo || {};
//       setInfoPopup({
//         noteId: note.$id,
//         x: parseFloat(width) + 25,
//         y: 0,
//         note: { title: JSON.parse(note.body) },
//         info: {
//           VIN: vehicleInfo.VIN || "N/A",
//           motorType: vehicleInfo.motorType || "Unknown",
//           mileage: vehicleInfo.mileage || "N/A",
//           partsUnavail: vehicleInfo.partsUnavail || [],
//         },
//       });

//       setContextMenu(null)
//     }, 10);
//   };

//   const handleOptionSelect = (action) => {
//     console.log('option selected', action)

//     if (action === "getInfo") {
//       console.log('clicked info')
//       openInfoPopup()
//     }

//     setTimeout(() => {
//       setContextMenu(null)
//     }, 100)
//   };


//   return (
//     <div
//       ref={cardRef}
//       className="card"
//       style={{
//         backgroundColor: isSelected ? "rgba(0, 123, 255, 0.1)" : noteData.colorBody || "blue",
//         width: width,
//         height: height,
//         left: position.x,
//         top: position.y,
//         border: isSelected ? "2px solid #007bff" : isHovered && !infoPopup ? "3px solid #FFD700" : "1px solid transparent",
//         boxSizing: "border-box",
//         transition: "border 0.3s ease, background-color 0.3s ease",
//         cursor: isHovered || isDragging ? "pointer" : "auto",
//         boxShadow: isHovered && !infoPopup ? "0 0 10px rgba(255, 215, 0, 0.7)" : isSelected ? "0 0 10px rgba(0, 123, 255, 0.7)" : "none",
//         transform: isHovered && !infoPopup ? "scale(1.05)" : "scale(1)",
//         transformOrigin: "center",
//         zIndex: isDragging ? 1000 : 10,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//       }}

//       onMouseEnter={() => {
//         if (!infoPopup) {
//           setIsHovered(true);
//         }
//       }}
//       onMouseLeave={() => {
//         if (!infoPopup) {
//           setIsHovered(false);
//         }
//       }}

//       onMouseDown={() => {
//         setInfoPopup(null)}
//       }

//       onContextMenu={handleContextMenu}

//     >
//       <img
//         ref={infoIconRef}
//         src={infoIcon}
//         alt="Info"
//         style={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           cursor: "pointer",
//           width: 20,
//           height: 20
//         }}
//         onClick={handleInfoClick}
//       />
//       <textarea
//         style={{
//           pointerEvents: "none",
//           color: noteData.colorText,
//           fontWeight: "bold",
//           fontSize: 18,
//           textAlign: "center",
//           verticalAlign: "middle",
//           border: "none",
//           backgroundColor: "transparent",
//           resize: "none",
//           cursor: "pointer",
//           width: "auto",
//           height: "auto",
//           padding: 0,
//           margin: 0,
//           display: "block",
//           lineHeight: `${height}px`,
//         }}
//         defaultValue={body}
//       ></textarea>

//       {contextMenu && (
//         <ContextMenu
//           id="context-menu"
//             //x={contextMenu.x}// * transform.scale + transform.translation.x}
//             //y={contextMenu.y}// * transform.scale + transform.translation.y}
//             x={contextMenu.x}
//             y={contextMenu.y}
//             type="note"
//             onOptionSelect={handleOptionSelect}
//             note={contextMenu.note}
//             style={{
//               position: "absolute",
//               //left: `${contextMenu.x * transform.scale + transform.translation.x}px`,
//               //top: `${contextMenu.y * transform.scale + transform.translation.y}px`,
//               zIndex: 9999,
//             }}
//           />
//         )}

//       {infoPopup && infoPopup.noteId == note.$id && (
//         <div
//           className="info-popup"
//           style={{
//             position: "absolute",
//             left: infoPopup.x,
//             top: infoPopup.y,
//             padding: "10px",
//             backgroundColor: "#2E2E2E",
//             color: "#FFFFFF",
//             border: "1px solid #444",
//             borderRadius: "5px",
//             zIndex: 1001,
//             display: "inline-block",
//             maxWidth: "400px",
//             minWidth: "200px",
//             wordWrap: "break-word",
//             cursor: "pointer",
//             overflow: "visible",
//           }}
//         >
//           <h3>{infoPopup.note.title}</h3>
//           <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
//           <p><strong>Motor Type:</strong> {infoPopup.info.motorType}</p>
//           <p><strong>Mileage:</strong> {infoPopup.info.mileage}</p>

//           <div>
//             <strong>Parts Unavailable:</strong>
//             <select
//               defaultValue=""
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setDropdownOpen(!dropdownOpen);
//               }}
//               style={{
//                 maxHeight: "50px",
//                 width: "100%",
//                 overflowY: "auto",
//                 zIndex: 1002
//               }}
//             >
//               <option value="" disabled>Click to view</option>
//               {infoPopup.info.partsUnavail.map((part, index) => (
//                 <option key={index} value={part.value}>
//                   {part.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             className="info-popup"
//             style={{
//               left: infoPopup.x,
//               top: infoPopup.y,
//               marginTop: "10px",
//               padding: "5px",
//               backgroundColor: "#444",
//               color: "#FFF",
//               border: "none",
//               borderRadius: "3px",
//               cursor: "pointer"
//             }}
//             onClick={() => setInfoPopup(null)}
//           >
//             Close
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NoteCard;





import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { setNewOffset, setZIndex, snapToGrid } from "../utils";
import { GLOBAL_SIZE } from "../assets/fakeData";
import infoIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/circle-info-solid.svg";
import ContextMenu from "../components/contextMenus.jsx";

export const gridSize = 25;

const NoteCard = ({ note, allNotes, onPositionChange, onPanningStateChange, isSelected, infoPopup, setInfoPopup, setContextMenu, contextMenu, transform, }) => {
  const body = JSON.parse(note.body);
  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
  const noteData = note.noteData ? JSON.parse(note.noteData) : [];
  const { width, height, padding } = JSON.parse(GLOBAL_SIZE);
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const infoIconRef = useRef(null)

  let mouseStartPos = { x: 0, y: 0 };

  useEffect(() => {

    const handleClick = (e) => {
      handleClickOutside(e)
    }

    if (contextMenu) {
      console.log("Adding event listener for outside click.");
      setTimeout(() => {
        document.addEventListener("mousedown", handleClick);
      }, 10); // Ensure the menu is rendered first
    }
  
    return () => {
      if (contextMenu) {
        console.log("Removing event listener for outside click.");
        document.removeEventListener("mousedown", handleClick);
      }
    };
  }, [contextMenu]);

  const handleClickOutside = (e) => {
    setTimeout(() => {
      const menu = document.getElementById('context-menu')
      console.log("checking menu:", menu, "clicked target:", e.target)

      if (!menu) {
        console.log("Menu does not exist at time of click")
        return
      }

      if (menu.contains(e.target)) {
        console.log("Click inside menu detected")
        return
      }

      console.log("click outside menu detected")

    }, 50);

  }

  const handleContextMenu = (e) => {
    console.log("context menu set")
    e.preventDefault();

    // if (contextMenu && contextMenu.note.$id === note.$id) {
    //   return
    // }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      note,
    })
    console.log('context menu set', e.clientY)

  }

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
    setInfoPopup(null)
    
    setTimeout(() => {
      openInfoPopup()      
    }, 10);
  }

  const openInfoPopup = () => {
    console.log('info popup opened')

    setTimeout(() => {
      setContextMenu(null)
    }, 50);

    setInfoPopup(null)    
    
    setTimeout(() => {
      const vehicleInfo = JSON.parse(note.noteData).vehicleInfo || {};
      setInfoPopup({
        noteId: note.$id,
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
    console.log('option selected', action)

    if (action === "getInfo") {
      console.log('clicked info')
      openInfoPopup()
    }

    setTimeout(() => {
      setContextMenu(null)
    }, 100)
  };


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

      {contextMenu && contextMenu.note.$id === note.$id && (
        <ContextMenu
          id="context-menu"
            //x={contextMenu.x}// * transform.scale + transform.translation.x}
            //y={contextMenu.y}// * transform.scale + transform.translation.y}
            x={contextMenu.x}
            y={contextMenu.y}
            type="note"
            onOptionSelect={handleOptionSelect}
            note={contextMenu.note}
            style={{
              position: "absolute",
              left: `${contextMenu.x}px`, // Use exact X-coordinate
              top: `${contextMenu.y}px`,  // Use exact Y-coordinate
              margin: "0",
              padding: "0",
              // left: `${contextMenu.x * transform.scale + transform.translation.x}px`,
              // top: `${contextMenu.y * transform.scale + transform.translation.y}px`,
              zIndex: 9999,
            }}
          />
        )}

      {infoPopup && infoPopup.noteId == note.$id && (
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












