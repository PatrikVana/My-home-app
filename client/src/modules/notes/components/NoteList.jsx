import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteNote } from "../../../store/notes/notesSlice";
import { addNotification } from "../../../store/notifications/notificationsSlice";
import "../styles/NoteList.css";

const NoteList = ({ notes, loading, onEditNote }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const dispatch = useDispatch();
  //useEffect pro efekt načítání obsahu poznámek
  useEffect(() => {
    if (!loading) {
      setInitialLoading(false);
    }
  }, [loading]);
  //funkce obsluhující redux funkci deleteNote a redux notifikace
  const handleDelete = (id) => {
    dispatch(deleteNote(id))
      .unwrap()
      .then(() => dispatch(addNotification("Poznámka smazána", "success")))
      .catch(() => dispatch(addNotification("Chyba při mazání poznámky", "error")));
  };

  return (
    <>
      <div className="note-list-main">
        {initialLoading && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Načítání...</span>
            </div>
          </div>
        )}

        {!initialLoading && (
          <div className="note-list-container">
            {notes.map((note) => (
              <div key={note._id} className="note-card">
                {note.color === "#ffffff" ? <span></span> :
                  <span className="note-color"
                    style={{ backgroundColor: note.color }}
                  ></span>
                }
                <h1 className="note-header">{note.header}</h1>
                <p className="note-date">
                  Vytvořeno: {new Date(note.createdAt).toLocaleDateString('cs-CZ', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
                <p className="note-text">{note.text}</p>
                <div className="note-control-panel">
                  <button className="note-edit-btn" onClick={() => onEditNote(note)}><i className="ri-edit-line"></i></button>
                  <button className="note-delete-btn" onClick={() => handleDelete(note._id)}><i className="ri-delete-bin-line"></i></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </>
  );
};

export default NoteList;
