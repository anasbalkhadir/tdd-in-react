import { Routes, Route } from "react-router";
import "./App.css";

import { NotesList } from "./components/notes-list";
import { NoteDetail } from "./components/note-detail";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route path="/note-list" element={<NotesList />} />
        <Route path="/note-detail/:noteId" element={<NoteDetail />} />
      </Routes>
    </div>
  );
}

export default App;
