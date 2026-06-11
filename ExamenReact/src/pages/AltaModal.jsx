import { useState } from 'react'
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;
const NOTES_URL = `${API_URL}notes`;

const COLORS = [
  { cls: "note-yellow", hex: "#FFF9C4" },
  { cls: "note-pink", hex: "#F8BBD0" },
  { cls: "note-blue", hex: "#BBDEFB" },
  { cls: "note-green", hex: "#C8E6C9" },
  { cls: "note-orange", hex: "#FFE0B2" },
]

const AltaModal = ({ isOpen, closeModal, onNoteAdded }) => {
  const { token } = useAuth();
  const [text, setText] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0].cls);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGuardaNota = async () => {
    if (!text.trim()) {
      setError('La nota no puede estar vacía');
      return;
    }
    if (text.length < 10) {
      setError('La nota debe tener al menos 10 caracteres');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(NOTES_URL, 
        { 
          text: text,
          color: selectedColor,
          done: false
        },
        { 
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      onNoteAdded(response.data.data);
      setText("");
      setSelectedColor(COLORS[0].cls);
      setError('');
      closeModal();
    } catch (err) {
      setError("Error guardando la nota: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ background: "rgba(0,0,0,0.45)", zIndex: 10 }}
      onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
    >
      <div
        className="bg-white rounded-3 p-4"
        style={{ width: 280, border: "0.5px solid rgba(0,0,0,0.12)" }}
        role="dialog"
        aria-modal="true"
      >
        <p className="fw-500 mb-3" style={{ fontSize: 14, color: "#111" }}>
          Nueva nota
        </p>
        <textarea
          className="form-control mb-3"
          style={{
            height: 90, fontSize: 13, resize: "none",
            background: "#f5f5f5", color: "#111",
            border: "0.5px solid rgba(0,0,0,0.2)",
          }}
          placeholder="Escribe tu nota aquí..."
          maxLength={200}
          value={text}
          onChange={e => setText(e.target.value)}
          autoFocus
        />
        {error && <p style={{ color: 'red', fontSize: 12 }}>{error}</p>}
        <div className="d-flex gap-2 mb-3">
          {COLORS.map(c => (
            <div
              key={c.cls}
              className={`tablon-color-dot${selectedColor === c.cls ? " selected" : ""}`}
              style={{ background: c.hex }}
              onClick={() => setSelectedColor(c.cls)}
              role="radio"
              aria-checked={selectedColor === c.cls}
              tabIndex={0}
            />
          ))}
        </div>
        <div className="d-flex gap-2 justify-content-end">
          <button
            className="tablon-modal-btn-cancel border rounded-2 px-3 py-1"
            style={{ fontSize: 13, cursor: "pointer" }}
            onClick={closeModal}
          >
            Cancelar
          </button>
          <button
            className="tablon-modal-btn-confirm border-0 rounded-2 px-3 py-1"
            style={{ fontSize: 13, fontWeight: 500, cursor: "pointer" }}
            onClick={handleGuardaNota}
            
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  )
}

export default AltaModal

