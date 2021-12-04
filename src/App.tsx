import React from "react";
import logo from "./logo.svg";
import "./App.css";

import { NotesList } from "./components/notes-list";

function App() {
  return (
    <div className="App">
      <NotesList />
    </div>
  );
}

export default App;
