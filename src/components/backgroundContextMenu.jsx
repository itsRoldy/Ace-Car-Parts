import React, { useEffect } from "react";

const BackgroundContextMenu = ({ position, onClose, onAdd }) => {
    const menuOptions = [
        {
            label: "Add",
            onClick: onAdd,
        },
    ]

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
      className="'.context-menu'"
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
          key={index}
          style={{
            padding: "8px",
            cursor: "pointer",
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

export default BackgroundContextMenu;
