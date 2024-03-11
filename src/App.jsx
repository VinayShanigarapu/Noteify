import { useContext, useEffect, useState } from "react";
import "./assets/css/app.css";
import { Navbar } from "./components/Navbar";
import { NoteCard } from "./components/NoteCard";
import { NoteDetails } from "./components/NoteDetails";
import { UpsertNote } from "./components/UpsertNote";
import { PaletteContext } from "./context/PaletteContext";
import Toast from "./components/Toast";
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from "./components/firebase";
import { writeBatch } from 'firebase/firestore';

const palettes = [
  { id: 1, color: "#1e4161", name: "blue-palette" },
  { id: 2, color: "#501b1d", name: "maroon-palette" },
  { id: 3, color: "#314731", name: "green-palette" },
  { id: 4, color: "#212020", name: "black-palette" },
];


export default function App() {
  const { state, dispatch } = useContext(PaletteContext);
  const [onCreateNote, setOnCreateNote] = useState(false);
  const [onViewNote, setOnViewNote] = useState(false);
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [search, setSearch] = useState("");
  const [showNoteCreatedToast, setShowNoteCreatedToast] = useState(false);
  const [showNoteUpdatedToast, setShowNoteUpdatedToast] = useState(false);
  const [showNoteDeletedToast, setShowNoteDeletedToast] = useState(false);

  const [currentPalette, setCurrentPalette] = useState(
    state?.palette
      ? palettes.find((p) => p.id === state.palette.id)
      : palettes[0]
  );
  const [sortOrder, setSortOrder] = useState("desc"); // Default to descending order
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const notesSnapshot = await getDocs(collection(db, 'users', user.uid, 'notes'));
          const notesData = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setNotes(notesData);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      } else {
        setNotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  
  const saveNotes = async (items) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const batch = writeBatch(db);
        
        // Loop through each note and add it to the batch
        items.forEach((note, index) => {
          const noteRef = doc(userDocRef, 'notes', `${note.id}`);
          batch.set(noteRef, note);
        });
  
        await batch.commit(); // Commit the batched writes
      }
      console.log('Current User UID:', user?.uid);
    } catch (error) {
      console.log('Error saving notes:', error);
    }
  };
  
  

  // Function to sort notes based on created time
  const sortNotes = (notesToSort) => {
    return notesToSort.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const handleCreateNote = (note) => {
    if (note) {
      const tempNotes = sortNotes([...notes, note]); // Sort notes after adding a new one
      setNotes(tempNotes);
      saveNotes(tempNotes);
      setShowNoteCreatedToast(true);
    }
  };

  const handleOnUpdate = (note) => {
    setCurrentNote(note);
    setOnCreateNote(true);
  };

  const handleUpdateNote = (note) => {
    if (note) {
      const tempNotes = sortNotes([...notes.map((n) => (n.id === note.id ? note : n))]);
      setNotes(tempNotes);
      setCurrentNote(null);
      saveNotes(tempNotes);
      setShowNoteUpdatedToast(true);
    }
  };

  const handleDeleteNote = async (noteId) => {
    const tempNotes = sortNotes([...notes.filter((n) => n.id !== noteId)]);
    setNotes(tempNotes);
    saveNotes(tempNotes);
    setShowNoteDeletedToast(true);
    await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'notes', noteId));
  };

  const handleOnPreview = (note) => {
    setCurrentNote(note);
    setOnViewNote(true);
  };

  let filteredNotes = [];

  if (search) {
    filteredNotes = [
      ...sortNotes(
        notes.filter((n) =>
          n.title.toLowerCase().includes(search.toLowerCase())
        )
      ),
    ];
  } else {
    filteredNotes = sortNotes([...notes]);
  }
  const handleAddNote = () => {
    setCurrentNote(null); // Reset current note
    setOnCreateNote(true);
  };
  useEffect(() => {
    if (showNoteCreatedToast) {
      const timer = setTimeout(() => {
        setShowNoteCreatedToast(false);
      }, 5000); // Adjust the duration to match your toast duration
      return () => clearTimeout(timer);
    }
    if (showNoteUpdatedToast) {
      const timer = setTimeout(() => {
        setShowNoteUpdatedToast(false);
      }, 5000); // Adjust the duration to match your toast duration
      return () => clearTimeout(timer);
    }
    if (showNoteDeletedToast) {
      const timer = setTimeout(() => {
        setShowNoteDeletedToast(false);
      }, 5000); // Adjust the duration to match your toast duration
      return () => clearTimeout(timer);
    }
  }, [showNoteCreatedToast,showNoteUpdatedToast,showNoteDeletedToast]);

  return (
    <div
      className={`app ${
        state?.palette ? state?.palette?.name : currentPalette?.name
      }`}
    >
      <Navbar
        setOpen={handleAddNote}
        state={state}
        dispatch={dispatch}
        setCurrentPalette={setCurrentPalette}
        palettes={palettes}
        currentPalette={currentPalette}
      />
      <div className="wrapper container">
        <div className="search-and-sort-wrapper">
          <div className="search-wrapper">
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="search-input"
              placeholder="Search"
            />
            <button className="search-btn">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>

          {/* Enhanced Sorting dropdown */}
          <div className="sort-wrapper">
            <label htmlFor="sortOrder" className="sort-label">
              Sort Order:
            </label>
            <select
              id="sortOrder"
              className="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Newest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
        </div>
        <div className="notes-wrapper">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note?.id}
              note={note}
              onDelete={handleDeleteNote}
              onUpdate={handleOnUpdate}
              onPreview={handleOnPreview}
            />
          ))}
        </div>
        {onCreateNote && (
          <UpsertNote
            note={currentNote}
            createNote={handleCreateNote}
            updateNote={handleUpdateNote}
            setOpen={setOnCreateNote}
          />
        )}
        {onViewNote && (
          <NoteDetails note={currentNote} setView={setOnViewNote} />
        )}
      </div>
      {showNoteCreatedToast && (
        <Toast message="Note Successfully Created.." toastType="success" duration={5000} />
      )}
      {showNoteUpdatedToast && (
        <Toast message="Note Successfully Updated.." toastType="success" duration={5000} />
      )}
      {showNoteDeletedToast && (
        <Toast message="Note Successfully Deleted.." toastType="success" duration={5000} />
      )}
    </div>
  );
}
