

import React, { useState, useEffect } from "react";
import { GLOBAL_SIZE, fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard, { gridSize } from "../components/NoteCard.jsx";
import { MapInteractionCSS } from "react-map-interaction";
import ContextMenu from "../components/contextMenus.jsx";

const NotesPage = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [isPanningDisabled, setIsPanningDisabled] = useState(false);
  const defaultTransform = {scale: 1, translation: {x: 0, y: 0 } }
  //const [transform, setTransform] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  const [transform, setTransform] = useState(defaultTransform)
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [backgroundContextMenu, setBackgroundContextMenu] = useState(null)
  const [infoPopup, setInfoPopup] = useState(null)
    

  const PAN_LIMITS = {
    minX: 2000,
    maxX: 0,
    minY: 2000,
    maxY: 0,
  }

  const handleContextMenu = (e) => {
    e.preventDefault()

    // Ensure the right click is on the background and not a notecard
    if (e.target.closest(".card")) {
      return
    }

    setBackgroundContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: "background"
    })
  }

  let startX = 0
  let startY = 0
  let isDragging = false

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      startX = e.clientX
      startY = e.clientY
      isDragging = false
    }
  }

  const handleMouseMove = (e) => {
    const diffX = Math.abs(e.clientX - startX)
    const diffY = Math.abs(e.clientY - startY)
    
    // If the mouse moves more than a few pixels, consider it a drag
    if (diffX > 5 || diffY > 5) {
      isDragging = true
    }
  }

  const handleMouseUp = (e) => {
    if (e.button === 0 && !isDragging) [
      setBackgroundContextMenu(null)
    ]
  };

  // Close the menu when clicking anywhere else
  const handleClick = (e) => {
    //e.preventDefault()
    if (e.button === 0) {
      if (isPanningDisabled) {
        setBackgroundContextMenu(null)
      }
    }
  }

  const handleResetView = () => {
    setTransform(defaultTransform)
  }

  const handlePanningStateChange = (state) => {
    setIsPanningDisabled(state);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") setIsPanningDisabled(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === "Shift") setIsPanningDisabled(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const sortNotes = (notesList) => {
    return notesList.sort((a, b) => a.position.y - b.position.y);
  };

  const onPositionChange = (updatedNote) => {
    const updatedNotes = notes.map((note) => (note.$id === updatedNote.$id ? updatedNote : note));
    const sortedNotes = sortNotes(updatedNotes);
    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };


  const handleSearchChange = (e) => {
    const query = e.target.value.toUpperCase();
    setSearchQuery(query);
    
    const filtered = notes.filter((note) => {
      try {
        return JSON.parse(note.body).toUpperCase().includes(query);
      } catch {
        return note.body.toUpperCase().includes(query);
      }
    });

    setFilteredNotes(filtered);
  };


  return (
    <div
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      //onContextMenu={handleClick}
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      <button
        onClick={handleResetView}
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "8px 12px",
          backgroundColor: "#007BFF",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        Reset View
      </button>
      
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "8px",
          borderRadius: "5px",
          backgroundColor: "#2E2E2E",
          color: "#FFFFFF",
          fontSize: "14px",
          width: "200px",
          zIndex: 999,
        }}
      />
      <MapInteractionCSS
        draggable={!isPanningDisabled}
        minScale={0.5}
        maxScale={1.5}
        value={transform}
        onChange={(newTransform) => {
          if (!isPanningDisabled) {
            setTransform({
              scale: newTransform.scale,
              translation: {
                x: Math.max(-PAN_LIMITS.minX, Math.min(PAN_LIMITS.maxX, newTransform.translation.x)),
                y: Math.max(-PAN_LIMITS.minY, Math.min(PAN_LIMITS.maxY, newTransform.translation.y)),
              }
            })
          }
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100000px",
            height: "100000px",
            transform: "translate(-50000px, -50000px)",
            backgroundColor: "#212228",
            backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />

        {/* Background Context Menu */}
          {backgroundContextMenu && (
            <ContextMenu
            x={backgroundContextMenu.x} 
            y={backgroundContextMenu.y} 
              type="background"
          />
        )}

        {notes.map((note) => {
          const isMatch = searchQuery === "" || filteredNotes.includes(note);
          return (
            <div
              key={note.$id}
              style={{
                opacity: isMatch ? 1 : 0.2, // Non-matching notes become transparent
                transition: "opacity 0.3s ease-in-out",
              }}
            >
              <NoteCard
                note={note}
                onPositionChange={onPositionChange}
                infoPopup={infoPopup}
                setInfoPopup={setInfoPopup}
                setContextMenu={setContextMenu} // Ensure this is passed
                contextMenu={contextMenu}
                transform={transform}
              />
            </div>
          );
        })}
      </MapInteractionCSS>

    </div>
  );
};

export default NotesPage;



