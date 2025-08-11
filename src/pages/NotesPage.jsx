
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { GLOBAL_SIZE, fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard, {InfoPopup, gridSize } from "../components/NoteCard.jsx";
import { MapInteractionCSS } from "react-map-interaction";
import ContextMenu from "../components/contextMenus.jsx";

const NotesPage = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [isPanningDisabled, setIsPanningDisabled] = useState(false);
  const [transform, setTransform] = useState({ scale: 1, translation: { x: 0, y: 0 } });
  const [infoPopup, setInfoPopup] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const handlePanningStateChange = (state) => {
    setIsPanningDisabled(state);
  };

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [contextMenu]);

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
    const updatedNotes = notes.map((note) =>
      note.$id === updatedNote.$id ? updatedNote : note
    );
    const sortedNotes = sortNotes(updatedNotes);
    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredNotes(
      notes.filter((note) => JSON.parse(note.body).toLowerCase().includes(query))
    );
  };

  // Right-click handler for notes
  const handleNoteRightClick = (e, note) => {
    e.preventDefault();
    const { translation, scale } = transform;

    // Raw page coordinates
    const pageX = e.clientX;
    const pageY = e.clientY;

    // Map-space coordinates (if needed for actions)
    const mapX = (pageX - translation.x) / scale;
    const mapY = (pageY - translation.y) / scale;

    setContextMenu({
      pageX,
      pageY,
      mapX,
      mapY,
      note,
    });
  };

  // Background right-click handler
  const handleBackgroundRightClick = (e) => {
    e.preventDefault(); // Prevent default browser menu

    const { translation, scale } = transform;

    const pageX = e.clientX;
    const pageY = e.clientY;

    const mapX = (pageX - translation.x) / scale;
    const mapY = (pageY - translation.y) / scale;

    setContextMenu({
      pageX,
      pageY,
      mapX,
      mapY,
      note: null, // null means background menu
    });
  };


  return (
    <div
      //onContextMenu={(e) => e.preventDefault()}
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
          }
        }}
      >
        <div
          onContextMenu={handleBackgroundRightClick}
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
            onNoteRightClick={handleNoteRightClick}
          />
        ))}
      </MapInteractionCSS>

      {contextMenu &&
        ReactDOM.createPortal(
          <ContextMenu
            id="context-menu"
            x={contextMenu.pageX}
            y={contextMenu.pageY}
            type={contextMenu.note ? "note" : "background"}

        onOptionSelect={(action) => {
          if (action === "info" && contextMenu.note) {
              // Open the info popup with the note data
              setInfoPopup({
                noteId: contextMenu.note.$id,
                x: contextMenu.pageX,
                y: contextMenu.pageY,
                note: { title: JSON.parse(contextMenu.note.body) },
                info: JSON.parse(contextMenu.note.noteData).vehicleInfo || {},
              });
            }
            setContextMenu(null);
          }}
              noteLabel={contextMenu.note ? JSON.parse(contextMenu.note.body) : undefined}
            />,
            document.body
        )}
      
      {infoPopup && (
        <InfoPopup
          //infoPopup={infoPopup}
          //setInfoPopup={setInfoPopup}
          note
          onClose={() => setInfoPopup(null)}
        />
      )}


      
    </div>
  );
};

export default NotesPage;
