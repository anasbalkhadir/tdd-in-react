import React, { useEffect, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import { Modal } from "../../shared/modal";

type note = {
  id: number;
  title: string;
  desc: string;
};

type notes = note[];

export const NotesList = () => {
  const [notes, setNotes] = useState<notes | null>(null);
  const [error, setError] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const fetchNotes = () => {
    axios
      .get("http://localhost:4333/notes-list")
      .then((response) => {
        const { data } = response;
        setNotes(data);
      })
      .catch(() => {
        setError(true);
      });
  };

  const onAddNoteSubmit = (event: React.FormEvent) => {
    console.log("onsubmit");

    // refetch notes list
    event.preventDefault();

    // Make POst api call
    axios
      .post("http://localhost:4333/notes-list", {
        title,
        desc,
      })
      .then((response) => {
        // Refetch Notes
        fetchNotes();
        setShowAddNoteModal(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    fetchNotes();
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
        <div>
          <ul data-testid="note-list">
            {notes.map((note) => {
              return (
                <li key={note.id}>
                  <Link
                    data-testid="note-list-item"
                    to={`/note-detail/${note.id}`}
                  >
                    {note.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div>
            <button onClick={() => setShowAddNoteModal(true)}>
              Add Notes{" "}
            </button>
          </div>

          <Modal
            isOpen={showAddNoteModal}
            closeModal={() => {
              setShowAddNoteModal(false);
            }}
          >
            <div>
              <form onSubmit={onAddNoteSubmit}>
                <div>
                  <label htmlFor="title" className="flex">
                    <div>Title</div>
                    <input
                      type="text"
                      className="p-2 bg-gray-50 border ml-2 w-full"
                      data-testid="title"
                      value={title}
                      onChange={(event) => {
                        setTitle(event.target.value);
                      }}
                    />
                  </label>
                </div>

                <div className="mt-2">
                  <label htmlFor="desc" className="flex">
                    <div>Desc</div>
                    <textarea
                      id="desc"
                      data-testid="desc"
                      className="p-2 bg-gray-50 border ml-2 w-full"
                      value={desc}
                      onChange={(event) => {
                        setDesc(event.target.value);
                      }}
                    />
                  </label>
                </div>

                <div className="mt-4">
                  <button
                    className="bg-purple-400  text-white rounded-sm py-2 px-4"
                    type="submit"
                    data-testid="save"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      ) : (
        <div> No Notes Avaliable </div>
      )}
    </div>
  );
};
