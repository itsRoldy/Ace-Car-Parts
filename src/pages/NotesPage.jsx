

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
  const [transform, setTransform] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [infoPopup, setInfoPopup] = useState(null)


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
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredNotes(notes.filter((note) => JSON.parse(note.body).toLowerCase().includes(query)));
  };
  

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
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
        value={transform}
        onChange={(newTransform) => {
          if (!isPanningDisabled) {
            setTransform(newTransform);

            // if (contextMenu) {
            //   setContextMenu((prev) => ({
            //     ...prev,
            //     x: contextMenu.x,// + (newTransform.translation.x - transform.translation.x),
            //     y: contextMenu.y,// + (newTransform.translation.y - transform.translation.y),
            //     //note: prev.note,
            //   }))
            // }
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
        {notes.map((note) => (
          <NoteCard
            key={note.$id}
            note={note}
            allNotes={notes}
            transform={transform}
            onPositionChange={onPositionChange}
            onPanningStateChange={handlePanningStateChange}
            infoPopup={infoPopup}
            setInfoPopup={setInfoPopup}
            setContextMenu={setContextMenu}
            contextMenu={contextMenu}
          />
        ))}
      </MapInteractionCSS>

    </div>
  );
};

export default NotesPage;



