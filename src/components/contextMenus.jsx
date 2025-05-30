
import React, { useEffect } from "react";
import NoteCard from "./NoteCard";

// Styles for the context menu
const menuStyle = {
  position: "absolute",
  backgroundColor: "#2E2E2E",
  color: "#FFFFFF",
  borderRadius: "5px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
  padding: "5px 0",
  whiteSpace: "nowrap",
  zIndex: 1000,
  pointerEvents: "auto",
};

const menuItemStyle = {
  padding: "8px 12px",
  cursor: "pointer",
};

const menuItemHoverStyle = {
  backgroundColor: "#555",
};

// Menu options configuration based on type
const MENU_OPTIONS = {
  background: [
    { label: "Add Note", action: "addNote" },
    { label: "Add Space", action: "addSpace" },
  ],

  note: [
    { label: "Info", action: "getInfo" },
    { label: "Read Messages", action: "readMessages" },
    { label: "Delete Note", action: "deleteNote" },
    { label: "Copy Note", action: "copyNote" },
  ],
};

// Reusable Context Menu Component
const ContextMenu = ({ x, y, type, onOptionSelect, noteLabel }) => {

  useEffect(() => {
    document.addEventListener("click", (e) => console.log("Click detected on:", e.target));
    return () => document.removeEventListener("click", (e) => console.log("Click detected on:", e.target));
  }, []);
  
  const options = MENU_OPTIONS[type] || []; // Select options based on the type

  const handleOptionClick = (e, action) => {
    e.stopPropagation()
    //console.log('context menu option clicked', action)

    setTimeout(() => {

      if (typeof onOptionSelect === "function") {
        onOptionSelect(action)
      } else {
        //console.error("onOptionSelect is not a function!", onOptionSelect)
      }

  }, 50);
  }



  return (
    <div
      id="context-menu"
      style={{ ...menuStyle, top: y, left: x }}>
      {type === "note" && (
        <div style={{ ...menuItemStyle, fontWeight: "bold" }}>
          {noteLabel}
        </div>
      )}
      {options.map((option) => (
        <div
          key={option.action}
          style={menuItemStyle}
          onMouseEnter={(e) => (e.target.style.backgroundColor = menuItemHoverStyle.backgroundColor)}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          onClick={(e) => {
            e.stopPropagation()
            handleOptionClick(e, option.action);
            //console.log('context menu clicked', e.target)
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );

};

export default ContextMenu;






