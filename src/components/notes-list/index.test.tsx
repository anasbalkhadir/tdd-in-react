import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";

import { rest } from "msw";
import { setupServer } from "msw/node";

import { NotesList } from "./index";

const server = setupServer(
  rest.get("http://localhost:4333/notes-list", (req, res, ctx) => {
    // Respond with a mocked user token that gets persisted
    // in the `sessionStorage` by the `Login` component.
    return res(
      ctx.json([
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
      ])
    );
  })
);

describe("Given NotesList", () => {
  beforeAll(() => {
    server.listen();
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

  test("WHEN notes-list component is mounted THEN render list of notes", async () => {
    render(<NotesList />);

    // wait for Data to load
    await waitForElementToBeRemoved(() =>
      screen.getByText("Loading Data ....")
    );

    const notes = screen.getAllByTestId("notes-list-item");

    const notesText = notes.map((note) => {
      return note.textContent;
    });

    expect(notesText).toEqual(["Learn React", "Learn React Query"]);
  });
});
