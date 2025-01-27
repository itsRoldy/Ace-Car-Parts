import React, { useEffect } from "react";

const CardContextMenu = ({ position, onClose, onEdit, onAdd, onDelete, onInfo }) => {

  const menuOptions = [
    {
      label: "Info",
      onClick: onInfo,
    },

    {
      label: "Read",
      onClick: onRead,
    },

    {
      label: "Delete",
      onClick: onDelete,
    },

    {
      label: "Copy",
      onClick: onCopy,
    },

    {
      label: "Add Note",
      onClick: onAddNote,
    },

    {
      label: "Add Space",
      onClick: onAddSpace,
    },    
    
  ]

/*     const menuOptions = [
        {
            label: "Edit",
            onClick: onEdit,
        },
        {
            label: "Add",
            onClick: onAdd,
        },
        {
            label: "Delete",
            onClick: onDelete,
        },

        {
          label: "Info",
          onClick: onInfo,
      },
    ] */

  const handleClickOutside = () => {
    onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundColor: "#212228" ,
        border: "1px solid #CCC",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "10px",
        zIndex: 1000,
      }}
    >
      {menuOptions.map((option, index) => (
        <div
          className="'.context-menu'"
          key={index}
          style={{
            padding: "8px",
            cursor: "pointer",
            //borderBottom: index < menuOptions.length - 1 ? "1px solid #EEE" : "none",
          }}
          onClick={() => {
            option.onClick();
            onClose();
          }}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

export default CardContextMenu;



