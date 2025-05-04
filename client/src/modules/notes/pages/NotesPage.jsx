import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NoteForm from "../components/NoteForm";
import NoteList from "../components/NoteList";
import NoteDetail from "../components/NoteDetail";
import NoteGroups from "../components/NoteGroups";
import {
  fetchNotes,
  fetchNoteGroups,
} from "../../../store/notes/notesSlice";
import "../styles/NotesPage.css"

export default function NotesPage() {
  const [selectedGroup, setSelectedGroup] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [mode, setMode] = useState("classic");
  const [selectedTaskId, setSelectedTaskId] = useState("default");

  const dispatch = useDispatch();
  const { notes, groups: noteGroups, loading } = useSelector((state) => state.notes);
  const { tasks } = useSelector((state) => state.tasks);


  useEffect(() => {
    dispatch(fetchNotes(selectedGroup));
  }, [dispatch, selectedGroup]);

  useEffect(() => {
    dispatch(fetchNoteGroups());
  }, [dispatch]);

  const filteredNotes = notes.filter((note) => {
    if (mode === "classic") {
      if (note.task) return false;
      return selectedGroup === "default" || note.group === selectedGroup;
    } else {
      return note.task && (selectedTaskId === "default" || note.task === selectedTaskId);
    }
  });
  return (
    <div className="container m-0 p-0">
      <div className="btn-group">
        <button
          className={`btn btn-sm ${mode === "classic" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => {
            setMode("classic");
            setSelectedTaskId("default");
          }}
        >
          Klasické
        </button>
        <button
          className={`btn btn-sm ${mode === "task" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => {
            setMode("task");
            setSelectedGroup("default");
          }}
        >
          Úkolové
        </button>
      </div>
      <div className="notes-page">
        <div className="task-groups">
          <NoteGroups
            noteGroups={noteGroups}
            selectedTaskId={selectedTaskId}
            setSelectedTaskId={setSelectedTaskId}
            mode={mode}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        </div>
          <div className="main-content">
            <div className="note-container">
              <div className={`note-list ${selectedNote ? "shrink" : ""}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h1>Poznámky</h1>
                  <button className="add-note-button" onClick={() => setShowModal(true)}>
                    <i className="ri-add-line"></i>
                  </button>
                </div>

                {loading && <p>Načítám poznámky...</p>}
                {!loading && notes.length === 0 && <p>Žádné poznámky k zobrazení.</p>}

                <NoteList
                  notes={filteredNotes}
                  loading={loading}
                  onEditNote={(note) => setSelectedNote(note)}
                />
              </div>
            </div>
            {selectedNote && (
              <NoteDetail
                note={selectedNote}
                onClose={() => setSelectedNote(null)}
              />
            )}
          </div>
        </div>
      {showModal && (
        <>
          <div className="modal-overlay" onClick={() => setShowModal(false)}></div>
          <div className="modal show d-block">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Přidat novou poznámku</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body">
                  <NoteForm
                    groups={noteGroups}
                    closeModal={() => setShowModal(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}