import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type note = {
  title: string;
  desc: string;
};

export const NoteDetail = () => {
  const [noteDetail, setNoteDetail] = useState<note | null>(null);
  const { noteId } = useParams<"noteId">();
  useEffect(() => {
    axios.get(`http://localhost:4333/notes-list/${noteId}`).then(({ data }) => {
      setNoteDetail(data);
    });
  }, []);

  if (noteDetail === null) {
    return <div>Loading Data</div>;
  }

  return (
    <div>
      <div data-testid="title">Title: {noteDetail.title}</div>
      <div data-testid="desc">Desc: {noteDetail.desc}</div>
    </div>
  );
};
