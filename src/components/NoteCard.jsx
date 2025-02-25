
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { setNewOffset, setZIndex, snapToGrid } from "../utils";
import { GLOBAL_SIZE } from "../assets/fakeData";
import infoIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/circle-info-solid.svg";
import rotateIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/rotate-right-solid.svg";
import messagesIcon from "K:/Projects/Coding Projects/Ace Car Parts/src/assets/icons/message-regular.svg"
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
  const dropdownRef = useRef(null)
  const [rotation, setRotation] = useState(0)
  const offset = useRef({ x: 0, y: 0 })

  let mouseStartPos = { x: 0, y: 0 };

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log(isDragging)
      if (contextMenu && !isDragging) {
        const menuElement = document.getElementById("context-menu");
  
        // Check if click is outside the context menu
        if (!menuElement || !menuElement.contains(e.target)) {
          setContextMenu(null); // Close the context menu
        }
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu, isDragging]);
  
  useEffect(() => {
  const handleRightClickOutside = (e) => {
    if (infoPopup) {
      const infoPopupElement = document.querySelector(".info-popup");
      
      if (!infoPopupElement || !infoPopupElement.contains(e.target)) {
        setInfoPopup(null); // Close popup if right-click happens outside of it
      }
    }
  };

  document.addEventListener("contextmenu", handleRightClickOutside);

  return () => {
    document.removeEventListener("contextmenu", handleRightClickOutside);
  };
  }, [infoPopup]);
  

  const handleContextMenu = (e, note) => {
    console.log("context menu set")
    e.preventDefault();

    // Prefent right clicking inside the existing context menu
    const existingMenu = document.getElementById("context-menu")
    if (existingMenu && existingMenu.contains(e.target)) {
      return
    }

    setContextMenu(null) // Close existing context menu before opening a new one

    setContextMenu({
      x: (e.clientX - transform.translation.x) / transform.scale,
      y: (e.clientY - transform.translation.y) / transform.scale,
      note,
    });
  }

  // const handleMouseMove = (e) => {
  //   setIsDragging(true)
    
  //   const mouseMoveDir = {
  //     x: mouseStartPos.x - e.clientX,
  //     y: mouseStartPos.y - e.clientY,
  //   };

  //   mouseStartPos.x = e.clientX;
  //   mouseStartPos.y = e.clientY;
  //   const newPosition = setNewOffset(cardRef.current, mouseMoveDir, padding);
  //   setPosition(newPosition);
  //   onPositionChange({ ...note, position: newPosition });
  // };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };


    const handleMouseUp = () => {
      setIsDragging(false);
      onPanningStateChange(true);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      snapToGrid(cardRef.current, padding, gridSize);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    onPanningStateChange(false);
  };

  const handleInfoClick = () => {
    setInfoPopup(null)
    
    setTimeout(() => {
      openInfoPopup()      
    }, 10);
  }

  const handleRotate = () => {
    setRotation((prevRotation) => prevRotation + 90)
  }

  const handleMessages = () => {

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
          MOTOR: vehicleInfo.MOTOR || "Unknown",
          TRANS: vehicleInfo.TRANS || "Unkown",
          MILEAGE: vehicleInfo.MILEAGE || "N/A",
          DRIVETYPE: vehicleInfo.DRIVETYPE || "N/A",
          EXTCOLOR: vehicleInfo.EXTCOLOR || "N/A",
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

  
  //Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  


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
        transform: `${isHovered && !infoPopup ? "scale(1.05)" : "scale(1)"} rotate(${rotation}deg)`,
        transformOrigin: "center",
        zIndex: isDragging ? 1000 : 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        //position: "relative",
        position:"absolute",
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

      onMouseDown={(e) => {
        handleMouseDown(e)
        if (e.button === 0 && !e.target.closest(".info-popup")) {
          setInfoPopup(null)
        }
      }}

      onContextMenu={(e) => {
        const infoPopupElement = document.querySelector(".info-popup")

        if (infoPopupElement && !infoPopupElement.contains(e.targtet)) {
          setInfoPopup(null)
        }
        handleContextMenu(e, note)
      }}

    >

    <img
      src={messagesIcon}
        alt="ReadMessages"
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        cursor: "pointer",
        width: 20,
        height: 20,
      }}
      onClick={handleMessages}
    />

    <img
      src={rotateIcon}
        alt="Rotate"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        cursor: "pointer",
        width: 20,
        height: 20,
      }}
      onClick={handleRotate}
    />
      
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
        //pointerEvents: "none",
        color: noteData.colorText,
        fontWeight: "bold",
        fontSize: 18,
        textAlign: "center",
        border: "none",
        backgroundColor: "transparent",
        resize: "none",
        cursor: "pointer",
        width: "80%",
        height: "auto",
        padding: 0,
        margin: 0,
        display: "block",
        //overflow: "hidden",
      }}
      defaultValue={body}
    ></textarea>

    {contextMenu && contextMenu.note.$id === note.$id && (
      ReactDOM.createPortal(
      <ContextMenu
        id="context-menu"
          x={contextMenu.x * transform.scale + transform.translation.x}
          y={contextMenu.y * transform.scale + transform.translation.y}
          type="note"
          onOptionSelect={handleOptionSelect}
          note={contextMenu.note}
          style={{
            position: "absolute",
            left: `${contextMenu.x * transform.scale + transform.translation.x}px`,
            top: `${contextMenu.y * transform.scale + transform.translation.y}px`,
            zIndex: 9999,
          }}
        />,
        document.body
      )
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
        // onContextMenu={(e) => {
        //   e.preventDefault()
        //   //e.stopPropagation()
        // }}
      >
        <h3>{infoPopup.note.title}</h3>
        <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
        <p><strong>Motor Type:</strong> {infoPopup.info.MOTOR}</p>
        <p><strong>Tranmission:</strong> {infoPopup.info.TRANS}</p>
        <p><strong>Mileage:</strong> {infoPopup.info.MILEAGE}</p>
        <p><strong>Drive Type:</strong> {infoPopup.info.DRIVETYPE}</p>
        <p><strong>Exterior Color:</strong> {infoPopup.info.EXTCOLOR}</p>

        
        <div>
          <strong>Parts Unavailable:</strong>
          <div style={{ position: "relative "}}>
            <select
              ref={dropdownRef}
              defaultValue=""
              onFocus={() => setDropdownOpen(true)}
              onBlur={() => setDropdownOpen(false)}
              size={dropdownOpen ? infoPopup?.info?.partsUnavail?.length || 5 : 1}
              style={{
                //position: "relative",
                width: "100%",
                fontSize: "14px",
                backgroundColor: "#222",
                color: "#FFF",
                border: "1px solide #444",
                borderRadius: "4px",
                cursor: "pointer",
                //appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                zIndex: 9999,
                overflowY: "auto",
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
        </div>

        <button
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
          onMouseDown={(e) => {
            if (e.button === 0) {
              setInfoPopup(null)
            }
          }}
        >
          Close
        </button>
      </div>
    )}
  </div>
  );
};

export default NoteCard;