import React, { useState, useRef, useEffect } from "react";
import { fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard from "../components/NoteCard.jsx";
import { GRID_CONFIG } from "../components/config.js";

const NotesPage = () => {
  const [notes, setNotes] = useState(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [hoverLineY, setHoverLineY] = useState(null);
  const [dropMenu, setDropMenu] = useState(null);

  const lastPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const cardRefs = useRef({});

  // Zoom handling
  useEffect(() => {
    const wheelHandler = (e) => {
      e.preventDefault();
      const zoomFactor = -e.deltaY * 0.001;
      setZoom((prev) => Math.min(Math.max(prev + zoomFactor, 0.5), 2));
    };
    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => window.removeEventListener("wheel", wheelHandler);
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      if (dropMenu) setDropMenu(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [dropMenu]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value.toLowerCase());

  const handleMouseMove = (e) => {
    if (isPanning) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const bounds = container.getBoundingClientRect();
    const mouseY = (e.clientY - bounds.top - pan.y) / zoom;

    const cards = Array.from(document.querySelectorAll(".note-card"));
    const cardRects = cards
      .map((c) => {
        const r = c.getBoundingClientRect();
        return {
          top: (r.top - bounds.top - pan.y) / zoom,
          bottom: (r.bottom - bounds.top - pan.y) / zoom,
        };
      })
      .sort((a, b) => a.top - b.top);

    let lineY = null;
    for (let i = 0; i < cardRects.length - 1; i++) {
      const a = cardRects[i];
      const b = cardRects[i + 1];
      if (mouseY > a.bottom && mouseY < b.top) {
        lineY = (a.bottom + b.top) / 2;
        break;
      }
    }

    setHoverLineY(lineY);
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleDrop = (id, e) => {
    if (hoverLineY === null || !id) return;

    const container = containerRef.current;
    if (!container) return;
    const bounds = container.getBoundingClientRect();

    const cards = Array.from(document.querySelectorAll(".note-card"));
    const cardRects = cards
      .map((c) => {
        const r = c.getBoundingClientRect();
        return { id: c.dataset.id, top: r.top - bounds.top, bottom: r.bottom - bounds.top };
      })
      .sort((a, b) => a.top - b.top);

    let insertIndex = notes.length;
    for (let i = 0; i < cardRects.length - 1; i++) {
      if (hoverLineY > cardRects[i].bottom && hoverLineY < cardRects[i + 1].top) {
        insertIndex = i + 1;
        break;
      }
    }

    // Show context menu at cursor
    setDropMenu({
      x: e.clientX,
      y: e.clientY,
      insertIndex,
      draggingNoteId: id,
    });

    setHoverLineY(null);
  };

  const filteredNotes = notes.filter((note) => {
    const vehicleInfo = note?.noteData?.vehicleInfo || {};
    const { VIN = "", YEAR = "", MAKE = "", MODEL = "" } = vehicleInfo;
    const body = note?.body || "";
    const searchText = `${YEAR} ${MAKE} ${MODEL} ${VIN} ${body}`.toLowerCase();
    return searchText.includes(searchQuery);
  });

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative" }}
      onContextMenu={(e) => e.preventDefault()}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search notes..."
        value={searchQuery}
        onChange={handleSearchChange}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px",
          borderRadius: "5px",
          backgroundColor: "#2E2E2E",
          color: "#FFF",
          fontSize: 14,
          width: 200,
          zIndex: 999,
        }}
      />

      {/* Grid background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#212228",
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_CONFIG.size * zoom}px ${GRID_CONFIG.size * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Notes Layer */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
          cursor: isPanning ? "grabbing" : "grab",
          zIndex: 1,
        }}
        onMouseDown={(e) => {
          if (e.button === 0) {
            setIsPanning(true);
            lastPos.current = { x: e.clientX, y: e.clientY };
          }
        }}
      >
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.$id}
            note={note}
            zoom={zoom}
            snap={GRID_CONFIG.snap}
            ref={(el) => (cardRefs.current[note.$id] = el)}
            className="note-card"
            onPositionChange={(updatedNote) =>
              setNotes((prev) =>
                prev.map((n) => (n.$id === updatedNote.$id ? updatedNote : n))
              )
            }
            onDragEnd={(id, e) => handleDrop(id, e)}
          />
        ))}

        {/* Horizontal yellow line */}
        {hoverLineY !== null && (
          <div
            style={{
              position: "absolute",
              top: hoverLineY,
              left: 0,
              width: "100%",
              height: 2,
              backgroundColor: "yellow",
              pointerEvents: "none",
              zIndex: 500,
            }}
          />
        )}
      </div>

      {/* Drop Context Menu */}
      {dropMenu && (
        <div
          style={{
            position: "fixed",
            top: dropMenu.y,
            left: dropMenu.x,
            background: "#2E2E2E",
            border: "1px solid #666",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
            zIndex: 2000,
            padding: "4px",
          }}
          onClick={(e) => e.stopPropagation()} // prevent outside click close
        >
          <div
            style={{ padding: "6px 12px", cursor: "pointer", color: "#fff" }}
            onClick={() => {
              setNotes((prev) => {
                const dragged = prev.find((n) => n.$id === dropMenu.draggingNoteId);
                const without = prev.filter((n) => n.$id !== dropMenu.draggingNoteId);
                // Insert ABOVE
                without.splice(dropMenu.insertIndex - 1, 0, dragged);
                return without;
              });
              setDropMenu(null);
            }}
          >
            Insert Above
          </div>
          <div
            style={{ padding: "6px 12px", cursor: "pointer", color: "#fff" }}
            onClick={() => {
              setNotes((prev) => {
                const dragged = prev.find((n) => n.$id === dropMenu.draggingNoteId);
                const without = prev.filter((n) => n.$id !== dropMenu.draggingNoteId);
                // Insert BELOW
                without.splice(dropMenu.insertIndex, 0, dragged);
                return without;
              });
              setDropMenu(null);
            }}
          >
            Insert Below
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
