import { useEffect, useState } from "react";
import axios from "axios";

type note = {
  id: number;
  title: string;
  desc: string;
};

type notes = note[];

export const NotesList = () => {
  const [notes, setNotes] = useState<notes | null>(null);

  useEffect(() => {
    axios.get("http://localhost:4333/notes-list").then((response) => {
      const { data } = response;
      setNotes(data);
    });
  }, []);

  if (notes === null) {
    return <div>Loading Data ....</div>;
  }

  return (
    <div>
      <ul>
        {notes.map((note) => {
          return (
            <li key={note.id} data-testid="notes-list-item">
              {note.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
