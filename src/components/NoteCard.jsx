import React, { forwardRef, useRef, useState, useEffect } from "react";
import interact from "interactjs";
import infoIcon from "../assets/icons/circle-info-solid.svg";
import rotateIcon from "../assets/icons/rotate-right-solid.svg";
import { GRID_CONFIG, NOTE_CONFIG } from "./config";

const NoteCard = forwardRef(({ note, onPositionChange, onDragEnd,zoom = 1, className }, ref) => {
  const noteData = note.noteData; // plain object now
  const body = note.body; // plain string now
  const { width, height, padding, fontSize, textColor } = NOTE_CONFIG; // plain object

  const [position, setPosition] = useState(note.position || { x: 0, y: 0 });
  const [rotation, setRotation] = useState(note.rotation || 0);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const el = cardRef.current;

    interact(el).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.snap({
          targets: [
            interact.snappers.grid({
              x: GRID_CONFIG.size * zoom,
              y: GRID_CONFIG.size * zoom,
            }),
          ],
          range: GRID_CONFIG.snap * zoom,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      listeners: {
        start() {
          document.body.style.userSelect = "none";
        },
        move(event) {
          setPosition((prev) => ({
            x: prev.x + event.dx / zoom,
            y: prev.y + event.dy / zoom,
          }));
        },
        end(event) {
          document.body.style.userSelect = "";
          if (onPositionChange) {
            onPositionChange({ ...note, position, rotation });
          }
          if (onDragEnd) {
            onDragEnd(note.$id, event);
          }
        },
      },
    });

    // ✅ only unset if el exists
    return () => {
      if (el) {
        interact(el).unset();
      }
    };
  }, [note, onPositionChange, zoom, rotation]);

  const handleRotateClick = (e) => {
    e.stopPropagation();
    setRotation((prev) => (prev === 0 ? 90 : 0));
  };

  return (
    <div
      ref={cardRef}
      onMouseDown={(e) => e.stopPropagation()}
      className={`note-card ${className}`}
      style={{
        position: "absolute",
        width,
        height,
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        backgroundColor: noteData.colorBody || "blue",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Info Icon */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "2px solid transparent",
          transition: "border 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.border = "2px solid yellow")}
        onMouseLeave={(e) => (e.currentTarget.style.border = "2px solid transparent")}
      >
        <img
          src={infoIcon}
          alt="Info"
          style={{
            width: 16,
            height: 16,
            pointerEvents: "none",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      {/* Rotate Icon */}
      <div
        onClick={handleRotateClick}
        style={{
          position: "absolute",
          top: 0,
          right: 30,
          width: 24,
          height: 24,
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "2px solid transparent",
          transition: "border 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.border = "2px solid yellow")}
        onMouseLeave={(e) => (e.currentTarget.style.border = "2px solid transparent")}
      >
        <img
          src={rotateIcon}
          alt="Rotate"
          style={{
            width: 16,
            height: 16,
            pointerEvents: "none",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      {/* Note body */}
      <div
        style={{
          color: textColor,
          fontWeight: "bold",
          fontSize: fontSize,
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
          padding: padding,
          flexDirection: "column",
          whiteSpace: "normal",
          wordBreak: "break-word",
        }}
      >
        {body}
      </div>
    </div>
  );
});

export default NoteCard;
