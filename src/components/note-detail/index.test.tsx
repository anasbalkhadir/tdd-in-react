import {
  render as renderRTL,
  waitForElementToBeRemoved,
  screen,
} from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { NoteDetail } from "./";

const server = setupServer();

const render = (ui: React.ReactNode) => {
  window.history.pushState({}, "", "/notes-list/1");
  return renderRTL(
    <BrowserRouter>
      <Routes>
        <Route path="/notes-list/:noteId" element={ui} />
      </Routes>
    </BrowserRouter>
  );
};

const customSetupServer = () => {
  return server.use(
    rest.get("http://localhost:4333/notes-list/1", (req, res, ctx) => {
      // Respond with a mocked user token that gets persisted
      // in the `sessionStorage` by the `Login` component.
      return res(
        ctx.json({
          title: "Learn Mobx",
          desc: "State Management Solutions",
        })
      );
    })
  );
};

describe("Given NoteDetail", () => {
  beforeAll(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    server.close();
  });

  test(`Scenario: WHEN component is mount THEN render note title and desc`, async () => {
    // Custom Server Setup
    customSetupServer();
    // Render
    render(<NoteDetail />);
    // wait for data to be loaded

    await waitForElementToBeRemoved(() => {
      return screen.getByText("Loading Data");
    });

    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("desc")).toBeInTheDocument();

    // check whether title & desc is rendereds
  });
});
