import {
  render as renderRTL,
  screen,
  waitForElementToBeRemoved,
  getByText,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { rest } from "msw";
import { setupServer } from "msw/node";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { NotesList } from "./index";

const server = setupServer();

const render = (ui: React.ReactNode) => {
  return renderRTL(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Given NotesList", () => {
  beforeAll(() => {
    server.listen();
  });

  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  // AAA

  // Arrange

  // Act

  // Assertion

  const customSetupServer = ({
    notes = [
      {
        id: 0,
        title: "Learn React",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in neque nisi. Phasellus placerat erat arcu. Fusce sed vehicula sem, vel viverra sapien. Quisque dapibus blandit ipsum nec aliquet. Suspendisse eget volutpat felis. Sed interdum turpis ac nulla imperdiet mollis. Mauris non iaculis enim. Nullam pretium metus purus, nec sagittis sapien tincidunt eget. Sed leo diam, sodales vel enim eu, vestibulum volutpat magna.",
      },
      {
        id: 1,
        title: "Learn React Query",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in neque nisi. Phasellus placerat erat arcu. Fusce sed vehicula sem, vel viverra sapien. Quisque dapibus blandit ipsum nec aliquet. Suspendisse eget volutpat felis. Sed interdum turpis ac nulla imperdiet mollis. Mauris non iaculis enim. Nullam pretium metus purus, nec sagittis sapien tincidunt eget. Sed leo diam, sodales vel enim eu, vestibulum volutpat magna.",
      },
    ],
  } = {}) => {
    return server.use(
      rest.get("http://localhost:4333/notes-list", (req, res, ctx) => {
        // Respond with a mocked user token that gets persisted
        // in the `sessionStorage` by the `Login` component.
        return res(ctx.json(notes));
      })
    );
  };

  test("WHEN notes-list component is mounted THEN render list of notes", async () => {
    customSetupServer();

    render(<NotesList />);

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const notes = screen.getAllByTestId("note-list-item");

    const notesText = notes.map((note) => {
      return note.textContent;
    });

    expect(notesText).toEqual(["Learn React", "Learn React Query"]);
  });

  test("WHEN noteslist api returns with no notes THEN render no notes data avaliable text", async () => {
    server.use(
      rest.get("http://localhost:4333/notes-list", (req, res, ctx) => {
        // Respond with a mocked user token that gets persisted
        // in the `sessionStorage` by the `Login` component.
        return res(ctx.json([]));
      })
    );

    render(<NotesList />);

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const noNotestListMessage = screen.getByText("No Notes Avaliable");

    expect(noNotestListMessage).toBeInTheDocument();
  });

  test("WHEN noteslist api returns error THEN render with error message text", async () => {
    server.use(
      rest.get("http://localhost:4333/notes-list", (req, res, ctx) => {
        // Respond with a mocked user token that gets persisted
        // in the `sessionStorage` by the `Login` component.
        return res(ctx.status(500), ctx.json({ message: "api call failed" }));
      })
    );

    render(<NotesList />);

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const errorMsg = screen.getByText("Something wen't wrong");

    expect(errorMsg).toBeInTheDocument();
  });

  test(`
  Scenario: User should be able to add note
  WHEN we click on add note button THEN render new note modal
  And WHEN we add title and description in add note form  and click on save THEN note should be added notes-list
  `, async () => {
    const notes = [
      {
        id: 0,
        title: "Learn React",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in neque nisi. Phasellus placerat erat arcu. Fusce sed vehicula sem, vel viverra sapien. Quisque dapibus blandit ipsum nec aliquet. Suspendisse eget volutpat felis. Sed interdum turpis ac nulla imperdiet mollis. Mauris non iaculis enim. Nullam pretium metus purus, nec sagittis sapien tincidunt eget. Sed leo diam, sodales vel enim eu, vestibulum volutpat magna.",
      },
      {
        id: 1,
        title: "Learn React Query",
        desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in neque nisi. Phasellus placerat erat arcu. Fusce sed vehicula sem, vel viverra sapien. Quisque dapibus blandit ipsum nec aliquet. Suspendisse eget volutpat felis. Sed interdum turpis ac nulla imperdiet mollis. Mauris non iaculis enim. Nullam pretium metus purus, nec sagittis sapien tincidunt eget. Sed leo diam, sodales vel enim eu, vestibulum volutpat magna.",
      },
    ];

    customSetupServer({ notes: notes });

    server.use(
      rest.post("http://localhost:4333/notes-list", (req, res, ctx) => {
        // Respond with a mocked user token that gets persisted
        // in the `sessionStorage` by the `Login` component.

        notes.push({
          id: 2,
          title: "Learn mobx",
          desc: "State Management Solution",
        });

        return res(ctx.status(200));
      })
    );

    render(<NotesList />);

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const addNoteButton = screen.getByText("Add Notes");

    userEvent.click(addNoteButton);

    const modal = screen.getByTestId("modal");

    expect(modal).toBeInTheDocument();

    userEvent.type(screen.getByTestId("title"), "Learn mobx");

    userEvent.type(screen.getByTestId("desc"), "State Management Solution");

    userEvent.click(screen.getByTestId("save"));

    await waitForElementToBeRemoved(() => {
      return screen.getByTestId("modal");
    });

    getByText(screen.getByTestId("note-list"), "Learn mobx");

    expect(screen.queryByTestId("modal")).toBeNull();
  });

  test(`Scenario: user should be able to redirect to note-detail
     WHEN user click on note title THEN user should be able to see note details 
  
  `, async () => {
    customSetupServer();

    window.history.pushState({}, "", "/");

    render(
      <Routes>
        <Route path="/" element={<NotesList />} />
        <Route
          path="/note-detail/:noteId"
          element={<div data-testid="note-detail-component"> Hello World </div>}
        />
      </Routes>
    );

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const notelist = screen.getAllByTestId("note-list-item");

    userEvent.click(notelist[0]);

    screen.getByTestId("note-detail-component");
  });
});
