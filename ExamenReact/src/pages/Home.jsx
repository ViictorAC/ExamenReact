import { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../auth/AuthContext";
import AltaModal from "./AltaModal";


const API_URL = import.meta.env.VITE_API_URL;
const NOTES_URL = `${API_URL}notes/all`;
const DELETE_URL = `${API_URL}notes`;

const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink", hex: "#F8BBD0" },
  { cls: "note-blue", hex: "#BBDEFB" },
  { cls: "note-green", hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
];

const NOTE_BG = {
  "note-yellow": "#FFF9C4",
  "note-pink": "#F8BBD0",
  "note-blue": "#BBDEFB",
  "note-green": "#C8E6C9",
  "note-orange": "#FFE0B2",
};

function noteRot(id) {
  return ((id * 7919) % 9) - 4;
}


const Home = () => {
  const [isOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState([]);
  const [allNotes, setAllNotes] = useState([]);
  const [error, setError] = useState(null);
  const [editandoNota, setEditandoNota] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const { token } = useAuth();

  const loadNotes = async () => {
    try {
      const response = await axios.get(NOTES_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.data);
      setAllNotes(response.data.data);
      setError(null);
    } catch (err) {
      setError("Error carregant les notes: " + err.message);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const eliminarNota = (id) => {
    axios.delete(`${DELETE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    })
      .then(() => setNotes(prev => prev.filter(note => note._id !== id)))
      .catch(err => console.error("Error eliminando:", err));
  }

  const cambiarFet = (id) => {
    axios.patch(`${DELETE_URL}/${id}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      
    })
      .then(() => setNotes(prev => prev.filter(note => note._id !== id)))
      .catch(err => console.error("Error cambiando estado:", err));
  }

  return (
  <>

    {/* Posar just abans del </> del component principal */}
    <button
      className="btn btn-dark rounded-circle shadow"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        width: '56px',
        height: '56px',
        fontSize: '1.5rem',
        zIndex: 1000,
      }}
      onClick={() => setModalOpen(true)}
      title="Nova nota"
    >
      <i className="bi bi-plus-lg"></i>
    </button>

    <AltaModal isOpen={isOpen} closeModal={() => setModalOpen(false)} onNoteAdded={(note) => setNotes([note, ...notes])} />

    {/* Contenido sobre el corcho */}
    <div className="position-relative p-2" style={{ zIndex: 1 }}>

      {notes.length === 0 ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-2"
          style={{ color: "rgba(80,40,5,0.45)" }}>
          <span style={{ fontSize: 36 }}>📌</span>
          <p className="mb-0" style={{ fontSize: 13 }}>No hay notas todavía. ¡Añade la primera!</p>
        </div>
      ) : (
        <div className="d-flex flex-wrap gap-3 justify-content-center" style={{ alignContent: "flex-start" }}>
          {notes.map(note => (
            <div key={note.id} className="col-3">
              <div
                className={`tablon-note${note.done ? " done" : ""}`}
                style={{
                  background: NOTE_BG[note.color],
                  transform: `rotate(${noteRot(note.id)}deg)`,
                }}
              >
                <div className="tablon-note-pin" />
                <div className={`tablon-note-text${note.done ? " done" : ""}`}>
                  {note.text}
                </div>
                <div className="tablon-note-date">{note.date}</div>
                <div className="tablon-note-user"> {note.user}</div>
                <div className="tablon-note-actions">
                  <button
                    className="tablon-note-btn done-btn"
                    aria-label={note.done ? "Marcar pendiente" : "Marcar completada"}
                    onClick={() => cambiarFet(note._id)}
                  >
                    {note.done ? "↺" : "✓"}
                  </button>
                  <button
                    className="tablon-note-btn del-btn"
                    aria-label="Eliminar nota"
                    onClick={() => eliminarNota(note._id)}
                  >
                    X

                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>



  </>
);
}

export default Home; 