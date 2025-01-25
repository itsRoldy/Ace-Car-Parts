/* 
import React, { useState, useEffect } from "react";
import { GLOBAL_SIZE, fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard, {gridSize} from "../components/NoteCard.jsx";
import ContextMenu from "../components/contextMenus.jsx";

const NotesPage = () => {

  const [notes, setNotes] = useState(initialNotes);
  const [unreadMessages, setUnreadMessage] = useState([])
  const [noteContextMenu, setNoteContextMenu] = useState(null);
  const [backgroundContextMenu, setBackgroundContextMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [draggedNote, setDraggedNote] = useState(null)
  const [linePosition, setLinePosition] = useState(null)
  const [infoPopup, setInfoPopup] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  const SPACING = 120;

  const { width, height } = JSON.parse(GLOBAL_SIZE)


  // Sort notes based on the position.y value
  const sortNotes = (notesList) => {
    return notesList.sort((a, b) => a.position.y - b.position.y);
  };

  // Handle position change for notes
  const onPositionChange = (updatedNote) => {
    const updatedNotes = notes.map((note) => 
      note.$id === updatedNote.$id ? updatedNote : note
    )
    
    const sortedNotes = sortNotes(updatedNotes)
    setNotes(sortedNotes)
    setFilteredNotes(sortedNotes)
    //console.log("onPositionChange", sortedNotes)    

  // Determine neighboring notes
  const index = sortedNotes.findIndex((note) => note.$id === updatedNote.$id);

  if (index > 0 && index < sortedNotes.length - 1) {
    const aboveNoteElement = document.getElementById(`note-${sortedNotes[index - 1].$id}`);
    const belowNoteElement = document.getElementById(`note-${sortedNotes[index + 1].$id}`);
    console.log(sortedNotes[index - 1].$id)
    console.log("aboveNoteElement", aboveNoteElement)
    console.log("belowNoteElement", belowNoteElement)

    // Ensure the elements are available before accessing their properties
    if (aboveNoteElement && belowNoteElement) {

        const aboveRect = aboveNoteElement.getBoundingClientRect();
        const belowRect = belowNoteElement.getBoundingClientRect();
        
        console.log("Above Rect: ", aboveRect);
        console.log("Below Rect: ", belowRect);

        // Check if the values are valid
        if (aboveRect.bottom !== 0 && belowRect.top !== 0) {
          const lineY = (aboveRect.bottom + belowRect.top) / 2;
          const lineXStart = Math.min(aboveRect.left, belowRect.left);
          const lineXEnd = Math.max(aboveRect.right, belowRect.right);


          console.log("Line Y: ", lineY);

          setLinePosition({
            top: lineY,
            left: lineXStart,
            width: lineXEnd - lineXStart,
          });
        }
    } else {
      setLinePosition(null);
    }
  } else {
    setLinePosition(null);
  }
};

  const handleDragStart = (note) => {
    setDraggedNote(note)
    document.body.style.userSelect = "none" //  Disable text selection during dragging
  }

  const handleDragEnd = () => {
    setDraggedNote(null)
    setLinePosition(null)
    document.body.style.userSelect = "auto" // Re-enable text selection after dragging ends
  }

  const handleNoteContextMenu = (e, note) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteContextMenu({ x: e.clientX, y: e.clientY, note });
    setBackgroundContextMenu(null);
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setBackgroundContextMenu({ x: e.clientX, y: e.clientY });
    setNoteContextMenu(null);
  };

  const closeContextMenus = () => {
    setNoteContextMenu(null);
    setBackgroundContextMenu(null);
  };

  const handleOptionSelect = (action, note = null) => {
    if (action === "addNote") {
      if (backgroundContextMenu) {
        const { x, y } = backgroundContextMenu;
        addNoteAtPosition(x, y);
      }
    }

    if (action === "getInfo" && note) {
      // Parse the noteData and show vehicle info in the popup
      const noteData = JSON.parse(note.noteData)
      const { VIN, partsUnavail, motorType, mileage } = noteData.vehicleInfo
      setInfoPopup({
        x: note.position.x + 250,
        y: note.position.y,
        note,
        info: { VIN, partsUnavail, motorType, mileage },
      })
    }

    if (action === "deleteNote" && note) {
      // Remove the note from the notes array
      const updatedNotes = notes.filter((n) => n.$id !== note.$id)
      setNotes(updatedNotes)
      setFilteredNotes(updatedNotes)
    }

    if (action === "copyNote" && note) {
      // Copy the note by creating a duplicate with a new unique ID
      const copiedNote = {
        ...note,
        $id: Date.now(), // Assign a new unique ID
        title: `${JSON.parse(note.body)} ()Copy)`,
        position: { ...note.position, x: note.position.x + 250, y: note.position.y }, // Copied note offset
      }

      const updatedNotes = [...notes, copiedNote]
      const sortedNotes = sortNotes(updatedNotes)

      setNotes(sortedNotes)
      setFilteredNotes(sortedNotes)
    }

    closeContextMenus();
  };


  const addNoteAtPosition = (x, y) => {
    const newNote = {
      $id: Date.now(),
      title: "New Note",
      body: JSON.stringify("New Note"),
      position: { x, y },
      colors: JSON.stringify({ colorBody: "gray" })
    };

    const updatedNotes = [...notes, newNote];
    const sortedNotes = sortNotes(updatedNotes)

    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };

  useEffect(() => {
    if (notes.length > initialNotes.length) {
      closeContextMenus();
    }
  }, [notes]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = notes.filter((note) => {
      const parsedBody = JSON.parse(note.body)
      const noteData = JSON.parse(note.noteData)
      const bodyMatch = parsedBody.toLowerCase().includes(query)
      //const vinMatch = noteData.vehicleInfo?.VIN?.toLowerCase().includes(query)
      //const vehicleInfoMatch = JSON.stringify(noteData.vehicleInfo).toLowerCase().includes(query)
      return bodyMatch
      //return bodyMatch || vinMatch || vehicleInfoMatch
    })

    setFilteredNotes(filtered)
  }

  // Handle drag events for the infoPopup
  const handleMouseDown = (e) => {
    if (infoPopup) {
      setDragging(true)
      setDragOffset({
        x: e.clientX - infoPopup.x,
        y: e.clientY - infoPopup.y,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (dragging && infoPopup) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setInfoPopup((prevPopup) => ({
        ...prevPopup,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Add event listeners for mouse move and mouse up
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      onClick={closeContextMenus} // Close context menus on left-click
      onContextMenu={handleBackgroundContextMenu}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: "#212228",
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,

      }}
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
          border: "none",
          outline: "none",
          backgroundColor: "#2E2E2E",
          color: "#FFFFFF",
          fontSize: "14px",
          width: "200px",
        }}
      />

      {notes.map((note) => (
        <div
          id={`note-${note.$id}`} // Unique id for each NoteCard
          key={note.$id}
          style={{
            opacity: searchQuery && !filteredNotes.includes(note) ? 0.2 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <NoteCard
            key={note.$id}
            note={note}
            onContextMenu={(e) => handleNoteContextMenu(e, note)}
            allNotes={notes} // Pass the notes array to each NoteCard
            onPositionChange={onPositionChange} // Pass position change handler
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        </div>
      ))}

      {linePosition && (
        <div
          style={{
            position: "absolute",
            left: `${linePosition.x1}px`,
            top: `${linePosition.y1}px`,
            width: `${linePosition.width}px`,
            height: "2px",
            backgroundColor: "red",
            zIndex: 999,
          }}
        />
      )}

      {backgroundContextMenu && (
        <ContextMenu
          x={backgroundContextMenu.x}
          y={backgroundContextMenu.y}
          type="background"
          onOptionSelect={(action) => handleOptionSelect(action)}
        />
      )}

      {noteContextMenu && (
        <ContextMenu
          x={noteContextMenu.x}
          y={noteContextMenu.y}
          type="note"
          onOptionSelect={(action) => handleOptionSelect(action, noteContextMenu.note)}
          note={noteContextMenu.note}
        />
      )}

      {infoPopup && (
        <div
          style={{
            position: "absolute",
            left: infoPopup.x,
            top: infoPopup.y,
            padding: "10px",
            backgroundColor: "#2E2E2E",
            color: "#FFFFFF",
            border: "1px solid #444",
            borderRadius: "5px",
            zIndex: 1000,
            display: "inline-block",
            maxWidth: "400px",
            minWidth: "200px",
            wordWrap: "break-word",
            cursor: "pointer", // Indicate that it's draggable
          }}
          onMouseDown={handleMouseDown}
          //<p><strong>Parts Unavailable:</strong> {infoPopup.info.partsUnavail.join(", ")}</p>
        >
          <h3>{infoPopup.note.title}</h3>
          <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
          <p><strong>Motor Type:</strong> {infoPopup.info.motorType}</p>
          <p><strong>Mileage:</strong> {infoPopup.info.mileage}</p>

          <div>
            <strong>Parts Unavailable:</strong>
            <select
              defaultValue=""
              style={{
                maxHeight: "50px",
                width: "100%",                
                overflowY: "auto",
              }}
            >
              <option value="" disabled>Click to view</option>
              {infoPopup.info.partsUnavail.map((part) => (
                <option key={part.value} value={part.value}>
                  {part.label}
                </option>
              ))}
            </select>
          </div>

          <button
            style={{
              marginTop: "10px",
              padding: "5px",
              backgroundColor: "#444",
              color: "#FFF",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
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

export default NotesPage; */





/* 
import React, { useState, useEffect } from "react";
import { GLOBAL_SIZE, fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard, {gridSize} from "../components/NoteCard.jsx";
import ContextMenu from "../components/contextMenus.jsx";

const NotesPage = () => {

  const [notes, setNotes] = useState(initialNotes);
  const [unreadMessages, setUnreadMessage] = useState([])
  const [noteContextMenu, setNoteContextMenu] = useState(null);
  const [backgroundContextMenu, setBackgroundContextMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [draggedNote, setDraggedNote] = useState(null)
  const [linePosition, setLinePosition] = useState(null)
  const [infoPopup, setInfoPopup] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [startPanPosition, setStartPanPosition] = useState(null)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })

  const SPACING = 120;

  const { width, height } = JSON.parse(GLOBAL_SIZE)


  // Sort notes based on the position.y value
  const sortNotes = (notesList) => {
    return notesList.sort((a, b) => a.position.y - b.position.y);
  };

  // Handle position change for notes
  const onPositionChange = (updatedNote) => {
    const updatedNotes = notes.map((note) => 
      note.$id === updatedNote.$id ? updatedNote : note
    )
    
    const sortedNotes = sortNotes(updatedNotes)
    setNotes(sortedNotes)
    setFilteredNotes(sortedNotes)
    //console.log("onPositionChange", sortedNotes)    

  // Determine neighboring notes
  const index = sortedNotes.findIndex((note) => note.$id === updatedNote.$id);

  if (index > 0 && index < sortedNotes.length - 1) {
    const aboveNoteElement = document.getElementById(`note-${sortedNotes[index - 1].$id}`);
    const belowNoteElement = document.getElementById(`note-${sortedNotes[index + 1].$id}`);
    console.log(sortedNotes[index - 1].$id)
    console.log("aboveNoteElement", aboveNoteElement)
    console.log("belowNoteElement", belowNoteElement)

    // Ensure the elements are available before accessing their properties
    if (aboveNoteElement && belowNoteElement) {

        const aboveRect = aboveNoteElement.getBoundingClientRect();
        const belowRect = belowNoteElement.getBoundingClientRect();
        
        console.log("Above Rect: ", aboveRect);
        console.log("Below Rect: ", belowRect);

        // Check if the values are valid
        if (aboveRect.bottom !== 0 && belowRect.top !== 0) {
          const lineY = (aboveRect.bottom + belowRect.top) / 2;
          const lineXStart = Math.min(aboveRect.left, belowRect.left);
          const lineXEnd = Math.max(aboveRect.right, belowRect.right);


          console.log("Line Y: ", lineY);

          setLinePosition({
            top: lineY,
            left: lineXStart,
            width: lineXEnd - lineXStart,
          });
        }
    } else {
      setLinePosition(null);
    }
  } else {
    setLinePosition(null);
  }
};


const handleBackgroundMouseDown = (e) => {
  setIsPanning(true)
  setStartPanPosition({ x: clientX, y: clientY })
}

const handleBackgroundMouseMove = (e) => {
  if (isPanning && startPanPosition) {
    const deltaX = e.clientX - startPanPosition.x
    const deltaY = e.clientY - startPanPosition.y
    setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setStartPanPosition({ x: e.clientX, y: clientY })
  }
}

const handleBackgroundMouseUp = () => {
  setIsPanning(false)
  setStartPanPosition(null)
}


useEffect(() => {
  if (isPanning) {
    window.addEventListener("mousemove", handleBackgroundMouseMove);
    window.addEventListener("mouseup", handleBackgroundMouseUp);
  } else {
    window.removeEventListener("mousemove", handleBackgroundMouseMove);
    window.removeEventListener("mouseup", handleBackgroundMouseUp);
  }

  return () => {
    window.removeEventListener("mousemove", handleBackgroundMouseMove);
    window.removeEventListener("mouseup", handleBackgroundMouseUp);
  };
}, [isPanning, startPanPosition]);


  const handleDragStart = (note) => {
    setDraggedNote(note)
    document.body.style.userSelect = "none" //  Disable text selection during dragging
  }

  const handleDragEnd = () => {
    setDraggedNote(null)
    setLinePosition(null)
    document.body.style.userSelect = "auto" // Re-enable text selection after dragging ends
  }

  const handleNoteContextMenu = (e, note) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteContextMenu({ x: e.clientX, y: e.clientY, note });
    setBackgroundContextMenu(null);
  };

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setBackgroundContextMenu({ x: e.clientX, y: e.clientY });
    setNoteContextMenu(null);
  };

  const closeContextMenus = () => {
    setNoteContextMenu(null);
    setBackgroundContextMenu(null);
  };

  const handleOptionSelect = (action, note = null) => {
    if (action === "addNote") {
      if (backgroundContextMenu) {
        const { x, y } = backgroundContextMenu;
        addNoteAtPosition(x, y);
      }
    }

    if (action === "getInfo" && note) {
      // Parse the noteData and show vehicle info in the popup
      const noteData = JSON.parse(note.noteData)
      const { VIN, partsUnavail, motorType, mileage } = noteData.vehicleInfo
      setInfoPopup({
        x: note.position.x + 250,
        y: note.position.y,
        note,
        info: { VIN, partsUnavail, motorType, mileage },
      })
    }

    if (action === "deleteNote" && note) {
      // Remove the note from the notes array
      const updatedNotes = notes.filter((n) => n.$id !== note.$id)
      setNotes(updatedNotes)
      setFilteredNotes(updatedNotes)
    }

    if (action === "copyNote" && note) {
      // Copy the note by creating a duplicate with a new unique ID
      const copiedNote = {
        ...note,
        $id: Date.now(), // Assign a new unique ID
        title: `${JSON.parse(note.body)} ()Copy)`,
        position: { ...note.position, x: note.position.x + 250, y: note.position.y }, // Copied note offset
      }

      const updatedNotes = [...notes, copiedNote]
      const sortedNotes = sortNotes(updatedNotes)

      setNotes(sortedNotes)
      setFilteredNotes(sortedNotes)
    }

    closeContextMenus();
  };


  const addNoteAtPosition = (x, y) => {
    const newNote = {
      $id: Date.now(),
      title: "New Note",
      body: JSON.stringify("New Note"),
      position: { x, y },
      colors: JSON.stringify({ colorBody: "gray" })
    };

    const updatedNotes = [...notes, newNote];
    const sortedNotes = sortNotes(updatedNotes)

    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };

  useEffect(() => {
    if (notes.length > initialNotes.length) {
      closeContextMenus();
    }
  }, [notes]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = notes.filter((note) => {
      const parsedBody = JSON.parse(note.body)
      const noteData = JSON.parse(note.noteData)
      const bodyMatch = parsedBody.toLowerCase().includes(query)
      //const vinMatch = noteData.vehicleInfo?.VIN?.toLowerCase().includes(query)
      //const vehicleInfoMatch = JSON.stringify(noteData.vehicleInfo).toLowerCase().includes(query)
      return bodyMatch
      //return bodyMatch || vinMatch || vehicleInfoMatch
    })

    setFilteredNotes(filtered)
  }

  // Handle drag events for the infoPopup
  const handleMouseDown = (e) => {
    if (infoPopup) {
      setDragging(true)
      setDragOffset({
        x: e.clientX - infoPopup.x,
        y: e.clientY - infoPopup.y,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (dragging && infoPopup) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setInfoPopup((prevPopup) => ({
        ...prevPopup,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Add event listeners for mouse move and mouse up
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      onClick={closeContextMenus} // Close context menus on left-click
      onContextMenu={handleBackgroundContextMenu}
      onMouseDown={handleBackgroundMouseDown}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        backgroundColor: "#212228",
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                          linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`,
        cursor: isPanning ? "grabbing" : "default",
      }}
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
          border: "none",
          outline: "none",
          backgroundColor: "#2E2E2E",
          color: "#FFFFFF",
          fontSize: "14px",
          width: "200px",
        }}
      />

      {notes.map((note) => (
        <div
          id={`note-${note.$id}`} // Unique id for each NoteCard
          key={note.$id}
          style={{
            opacity: searchQuery && !filteredNotes.includes(note) ? 0.2 : 1,
            transition: "opacity 0.3s ease-in-out",
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          <NoteCard
            key={note.$id}
            note={note}
            onContextMenu={(e) => handleNoteContextMenu(e, note)}
            allNotes={notes} // Pass the notes array to each NoteCard
            onPositionChange={onPositionChange} // Pass position change handler
            //onDragStart={handleDragStart}
            //onDragEnd={handleDragEnd}
          />
        </div>
      ))}


      {backgroundContextMenu && (
        <ContextMenu
          x={backgroundContextMenu.x}
          y={backgroundContextMenu.y}
          type="background"
          onOptionSelect={(action) => handleOptionSelect(action)}
        />
      )}

      {noteContextMenu && (
        <ContextMenu
          x={noteContextMenu.x}
          y={noteContextMenu.y}
          type="note"
          onOptionSelect={(action) => handleOptionSelect(action, noteContextMenu.note)}
          note={noteContextMenu.note}
        />
      )}

      {infoPopup && (
        <div
          style={{
            position: "absolute",
            left: infoPopup.x,
            top: infoPopup.y,
            padding: "10px",
            backgroundColor: "#2E2E2E",
            color: "#FFFFFF",
            border: "1px solid #444",
            borderRadius: "5px",
            zIndex: 1000,
            display: "inline-block",
            maxWidth: "400px",
            minWidth: "200px",
            wordWrap: "break-word",
            cursor: "pointer", // Indicate that it's draggable
          }}
          onMouseDown={handleMouseDown}
          //<p><strong>Parts Unavailable:</strong> {infoPopup.info.partsUnavail.join(", ")}</p>
        >
          <h3>{infoPopup.note.title}</h3>
          <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
          <p><strong>Motor Type:</strong> {infoPopup.info.motorType}</p>
          <p><strong>Mileage:</strong> {infoPopup.info.mileage}</p>

          <div>
            <strong>Parts Unavailable:</strong>
            <select
              defaultValue=""
              style={{
                maxHeight: "50px",
                width: "100%",                
                overflowY: "auto",
              }}
            >
              <option value="" disabled>Click to view</option>
              {infoPopup.info.partsUnavail.map((part) => (
                <option key={part.value} value={part.value}>
                  {part.label}
                </option>
              ))}
            </select>
          </div>

          <button
            style={{
              marginTop: "10px",
              padding: "5px",
              backgroundColor: "#444",
              color: "#FFF",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
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

export default NotesPage;

 */



import React, { useState, useEffect, useReducer } from "react";
import { GLOBAL_SIZE, fakeData as initialNotes } from "../assets/fakeData.js";
import NoteCard, {gridSize} from "../components/NoteCard.jsx";
import ContextMenu from "../components/contextMenus.jsx";
import { MapInteractionCSS } from 'react-map-interaction';

const NotesPage = () => {

  const [notes, setNotes] = useState(initialNotes);
  const [unreadMessages, setUnreadMessage] = useState([])
  const [noteContextMenu, setNoteContextMenu] = useState(null);
  const [backgroundContextMenu, setBackgroundContextMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNotes, setFilteredNotes] = useState(initialNotes);
  const [draggedNote, setDraggedNote] = useState(null)
  const [linePosition, setLinePosition] = useState(null)
  const [infoPopup, setInfoPopup] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isPanningDisabled, setIsPanningDisabled] = useState(false)
  const [transform, setTransform] = useState({ scale: 1, translation: { x: 0, y: 0 },})

  const SPACING = 120;

  const { width, height } = JSON.parse(GLOBAL_SIZE)


  const handlePanningStateChange = (state) => {
    setIsPanningDisabled(state)
  }

  // Event listeners for Shift key to enable/disable panning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Shift") {
        setIsPanningDisabled(true); // Disable panning when Shift is held
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "Shift") {
        setIsPanningDisabled(false); // Enable panning when Shift is released
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Sort notes based on the position.y value
  const sortNotes = (notesList) => {
    return notesList.sort((a, b) => a.position.y - b.position.y);
  };

  // Handle position change for notes
  const onPositionChange = (updatedNote) => {
    const updatedNotes = notes.map((note) => 
      note.$id === updatedNote.$id ? updatedNote : note
    )
    
    const sortedNotes = sortNotes(updatedNotes)
    setNotes(sortedNotes)
    setFilteredNotes(sortedNotes)
    //console.log("onPositionChange", sortedNotes)    

  // Determine neighboring notes
  const index = sortedNotes.findIndex((note) => note.$id === updatedNote.$id);

  if (index > 0 && index < sortedNotes.length - 1) {
    const aboveNoteElement = document.getElementById(`note-${sortedNotes[index - 1].$id}`);
    const belowNoteElement = document.getElementById(`note-${sortedNotes[index + 1].$id}`);
    console.log(sortedNotes[index - 1].$id)
    console.log("aboveNoteElement", aboveNoteElement)
    console.log("belowNoteElement", belowNoteElement)

    // Ensure the elements are available before accessing their properties
    if (aboveNoteElement && belowNoteElement) {

        const aboveRect = aboveNoteElement.getBoundingClientRect();
        const belowRect = belowNoteElement.getBoundingClientRect();
        
        console.log("Above Rect: ", aboveRect);
        console.log("Below Rect: ", belowRect);

        // Check if the values are valid
        if (aboveRect.bottom !== 0 && belowRect.top !== 0) {
          const lineY = (aboveRect.bottom + belowRect.top) / 2;
          const lineXStart = Math.min(aboveRect.left, belowRect.left);
          const lineXEnd = Math.max(aboveRect.right, belowRect.right);


          console.log("Line Y: ", lineY);

          setLinePosition({
            top: lineY,
            left: lineXStart,
            width: lineXEnd - lineXStart,
          });
        }
    } else {
      setLinePosition(null);
    }
  } else {
    setLinePosition(null);
  }
};

/*   const handleNoteContextMenu = (e, note) => {
    e.preventDefault();
    e.stopPropagation();
    setNoteContextMenu({ x: e.clientX, y: e.clientY, note });
    setBackgroundContextMenu(null);
  }; */

  const handleNoteContextMenu = (e, note) => {
    e.preventDefault()
    e.stopPropagation()

    const { scale, translation } = transform

    // Adjust the menu position based on the pan and zoom
    const adjustedX = (e.clientX - translation.x) / scale
    const adjustedY = (e.clientY - translation.y) / scale

    setNoteContextMenu({ x: adjustedX, y: adjustedY, note })
    setBackgroundContextMenu(null)
  }

/*   const handleBackgroundContextMenu = (e) => {
    e.preventDefault();
    setBackgroundContextMenu({ x: e.clientX, y: e.clientY });
    setNoteContextMenu(null);
  }; */

  const handleBackgroundContextMenu = (e) => {
    e.preventDefault()

    const { scale, translation } = transform // Use the current transformation state

    // Adjust the menu position based on the pan and zoom
    const adjustedX = (e.clientX - translation.x) / scale
    const adjustedY = (e.clientY - translation.y) / scale

    setBackgroundContextMenu({ x: adjustedX, y: adjustedY })
    setNoteContextMenu(null)
  }

  const closeContextMenus = () => {
    setNoteContextMenu(null);
    setBackgroundContextMenu(null);
  };

  const handleOptionSelect = (action, note = null) => {
    if (action === "addNote") {
      if (backgroundContextMenu) {
        const { x, y } = backgroundContextMenu;
        addNoteAtPosition(x, y);
      }
    }

    if (action === "getInfo" && note) {
      // Parse the noteData and show vehicle info in the popup
      const noteData = JSON.parse(note.noteData)
      const { VIN, partsUnavail, motorType, mileage } = noteData.vehicleInfo
      setInfoPopup({
        x: note.position.x + 250,
        y: note.position.y,
        note,
        info: { VIN, partsUnavail, motorType, mileage },
      })
    }

    if (action === "deleteNote" && note) {
      // Remove the note from the notes array
      const updatedNotes = notes.filter((n) => n.$id !== note.$id)
      setNotes(updatedNotes)
      setFilteredNotes(updatedNotes)
    }

    if (action === "copyNote" && note) {
      // Copy the note by creating a duplicate with a new unique ID
      const copiedNote = {
        ...note,
        $id: Date.now(), // Assign a new unique ID
        title: `${JSON.parse(note.body)} ()Copy)`,
        position: { ...note.position, x: note.position.x + 250, y: note.position.y }, // Copied note offset
      }

      const updatedNotes = [...notes, copiedNote]
      const sortedNotes = sortNotes(updatedNotes)

      setNotes(sortedNotes)
      setFilteredNotes(sortedNotes)
    }

    closeContextMenus();
  };


  const addNoteAtPosition = (x, y) => {
    const newNote = {
      $id: Date.now(),
      title: "New Note",
      body: JSON.stringify("New Note"),
      position: { x, y },
      colors: JSON.stringify({ colorBody: "gray" })
    };

    const updatedNotes = [...notes, newNote];
    const sortedNotes = sortNotes(updatedNotes)

    setNotes(sortedNotes);
    setFilteredNotes(sortedNotes);
  };

  useEffect(() => {
    if (notes.length > initialNotes.length) {
      closeContextMenus();
    }
  }, [notes]);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    const filtered = notes.filter((note) => {
      const parsedBody = JSON.parse(note.body)
      const noteData = JSON.parse(note.noteData)
      const bodyMatch = parsedBody.toLowerCase().includes(query)
      //const vinMatch = noteData.vehicleInfo?.VIN?.toLowerCase().includes(query)
      //const vehicleInfoMatch = JSON.stringify(noteData.vehicleInfo).toLowerCase().includes(query)
      return bodyMatch
      //return bodyMatch || vinMatch || vehicleInfoMatch
    })

    setFilteredNotes(filtered)
  }

  // Handle drag events for the infoPopup
  const handleMouseDown = (e) => {
    if (infoPopup) {
      setDragging(true)
      setDragOffset({
        x: e.clientX - infoPopup.x,
        y: e.clientY - infoPopup.y,
      })
    }
  }

  const handleMouseMove = (e) => {
    if (dragging && infoPopup) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setInfoPopup((prevPopup) => ({
        ...prevPopup,
        x: newX,
        y: newY,
      }));
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Add event listeners for mouse move and mouse up
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      onClick={closeContextMenus} // Close context menus on left-click
      onContextMenu={handleBackgroundContextMenu}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
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
          border: "none",
          outline: "none",
          backgroundColor: "#2E2E2E",
          color: "#FFFFFF",
          fontSize: "14px",
          width: "200px",
          zIndex: 999,
        }}
      />
      <MapInteractionCSS
        draggable={!isPanningDisabled}
        value={transform} // Bind the current transform state
        onChange={(newtransform) => {
          if (!isPanningDisabled) [
            // Apply the transformation only if panning is enabled
            setTransform(newtransform)
          ]
        }}>
        <div // Infinite Grid Container
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100000px", // Simulate infinite width
              height: "100000px", // Simulate infinite height
              transform: "translate(-50000px, -50000px)", // Center the grid
              backgroundColor: "#212228",
              backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: `${gridSize}px ${gridSize}px`,
            }}
          />

        {notes.map((note) => (
          <div
            id={`note-${note.$id}`} // Unique id for each NoteCard
            key={note.$id}
            style={{
              opacity: searchQuery && !filteredNotes.includes(note) ? 0.2 : 1,
              transition: "opacity 0.3s ease-in-out",
            }}
            className="note-card" // Add the class to target with Selecto
          >
            <NoteCard
              key={note.$id}
              note={note}
              onContextMenu={(e) => handleNoteContextMenu(e, note)}
              allNotes={notes} // Pass the notes array to each NoteCard
              onPositionChange={onPositionChange} // Pass position change handler
              onMouseDown={handleMouseDown} // Trigger the mousedown handler
              onPanningStateChange={handlePanningStateChange}
              //onDragStart={handleDragStart}
              //onDragEnd={handleDragEnd}
            />
          </div>
        ))}



      {backgroundContextMenu && (
        <ContextMenu
          x={backgroundContextMenu.x}
          y={backgroundContextMenu.y}
          type="background"
          onOptionSelect={(action) => handleOptionSelect(action)}
          style={{
            position: "absolute",
            transform: `translate(${backgroundContextMenu.x}px, ${backgroundContextMenu.y}px)`,
          }}
        />
      )}

      {noteContextMenu && (
        <ContextMenu
          x={noteContextMenu.x}
          y={noteContextMenu.y}
          type="note"
          onOptionSelect={(action) => handleOptionSelect(action, noteContextMenu.note)}
          note={noteContextMenu.note}
          style={{
            position: "absolute",
            transform: `translate(${noteContextMenu.x}px, ${noteContextMenu.y}px)`,
          }}
        />
      )}

      {infoPopup && (
        <div
          style={{
            position: "absolute",
            left: infoPopup.x,
            top: infoPopup.y,
            padding: "10px",
            backgroundColor: "#2E2E2E",
            color: "#FFFFFF",
            border: "1px solid #444",
            borderRadius: "5px",
            zIndex: 1000,
            display: "inline-block",
            maxWidth: "400px",
            minWidth: "200px",
            wordWrap: "break-word",
            cursor: "pointer", // Indicate that it's draggable
          }}
          onMouseDown={handleMouseDown}
          //<p><strong>Parts Unavailable:</strong> {infoPopup.info.partsUnavail.join(", ")}</p>
        >
          <h3>{infoPopup.note.title}</h3>
          <p><strong>VIN:</strong> {infoPopup.info.VIN}</p>
          <p><strong>Motor Type:</strong> {infoPopup.info.motorType}</p>
          <p><strong>Mileage:</strong> {infoPopup.info.mileage}</p>

          <div>
            <strong>Parts Unavailable:</strong>
            <select
              defaultValue=""
              style={{
                maxHeight: "50px",
                width: "100%",                
                overflowY: "auto",
              }}
            >
              <option value="" disabled>Click to view</option>
              {infoPopup.info.partsUnavail.map((part) => (
                <option key={part.value} value={part.value}>
                  {part.label}
                </option>
              ))}
            </select>
          </div>

          <button
            style={{
              marginTop: "10px",
              padding: "5px",
              backgroundColor: "#444",
              color: "#FFF",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={() => setInfoPopup(null)}
          >
            Close
          </button>
        </div>
      )}
      </MapInteractionCSS>
    </div>
  );
}; 

export default NotesPage;

