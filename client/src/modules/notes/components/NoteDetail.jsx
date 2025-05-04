import { X } from "lucide-react";
import EditNoteForm from "./EditNoteForm";
import "../styles/NoteDetail.css";

const NoteDetail = ({ note, onClose }) => {
  return (
    <div className={`note-detail ${note ? "open" : ""}`}>
      {/* Zavírací tlačítko */}
      <button className="close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* Titulek */}
      <h2>Upravit poznámku</h2>

      {/* Formulář pro editaci poznámky */}
      <EditNoteForm note={note} closeModal={onClose} />
    </div>
  );
};

export default NoteDetail;
