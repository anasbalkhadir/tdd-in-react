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
  const [error, setError] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:4333/notes-list")
      .then((response) => {
        const { data } = response;
        setNotes(data);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  if (error) {
    return <div>Something wen't wrong</div>;
  }

  if (notes === null) {
    return <div>Loading Data ....</div>;
  }

  return (
    <div>
      {notes.length > 0 ? (
        <ul>
          {notes.map((note) => {
            return (
              <li key={note.id} data-testid="notes-list-item">
                {note.title}
              </li>
            );
          })}
        </ul>
      ) : (
        <div> No Notes Avaliable </div>
      )}
    </div>
  );
};
