/* import React, { useState, useEffect } from "react";
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


    if (action === "getInfo" && note){
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

export default NotesPage;


 */




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

export default NotesPage;


