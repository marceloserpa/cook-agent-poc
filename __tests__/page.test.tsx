import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "../app/page";

const STORAGE_KEY = "todo-list-tasks";

async function renderHome() {
  render(<Home />);
  await waitFor(() => {
    expect(screen.queryByText("Loading tasks...")).toBeNull();
  });
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("Todo List", () => {
  it("shows the initial empty state and disables Add for an empty input", async () => {
    await renderHome();

    expect(
      screen.getByRole("heading", { level: 1, name: "Todo List" }),
    ).toBeDefined();
    expect(
      screen.getByText("Nothing here yet — add your first task."),
    ).toBeDefined();
    expect(
      (screen.getByRole("button", { name: "Add" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
  });

  it("does not add a blank or whitespace-only task", async () => {
    await renderHome();

    const input = screen.getByPlaceholderText("What needs to be done?");
    const form = input.closest("form");
    expect(form).not.toBeNull();

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(form!);

    expect(
      screen.getByText("Nothing here yet — add your first task."),
    ).toBeDefined();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("trims and adds a task, then clears the input", async () => {
    await renderHome();

    const input = screen.getByPlaceholderText(
      "What needs to be done?",
    ) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "  Review the PR  " } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(
      screen.getByRole("checkbox", { name: "Review the PR" }),
    ).toBeDefined();
    expect(input.value).toBe("");
    expect(screen.getByText("1 of 1 task remaining")).toBeDefined();
  });

  it("toggles completion and updates the remaining-task count", async () => {
    await renderHome();

    const input = screen.getByPlaceholderText("What needs to be done?");
    const addButton = screen.getByRole("button", { name: "Add" });

    fireEvent.change(input, { target: { value: "First task" } });
    fireEvent.click(addButton);
    fireEvent.change(input, { target: { value: "Second task" } });
    fireEvent.click(addButton);

    expect(screen.getByText("2 of 2 tasks remaining")).toBeDefined();

    const firstTask = screen.getByRole("checkbox", { name: "First task" });
    fireEvent.click(firstTask);

    expect((firstTask as HTMLInputElement).checked).toBe(true);
    expect(screen.getByText("1 of 2 tasks remaining")).toBeDefined();

    fireEvent.click(firstTask);

    expect((firstTask as HTMLInputElement).checked).toBe(false);
    expect(screen.getByText("2 of 2 tasks remaining")).toBeDefined();
  });

  it("renders a hydration-safe loading state without flashing the empty state", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ text: "Saved task", done: false }]),
    );

    const html = renderToString(<Home />);

    expect(html).toContain("Loading tasks...");
    expect(html).not.toContain("Nothing here yet");

    await renderHome();

    expect(screen.getByRole("checkbox", { name: "Saved task" })).toBeDefined();
    expect(screen.queryByText("Nothing here yet — add your first task.")).toBeNull();
  });

  it("does not allow a submission to race the initial restore", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ text: "Saved task", done: false }]),
    );
    render(<Home />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "Early task" } });
    fireEvent.submit(input.closest("form")!);

    expect(
      (screen.getByRole("button", { name: "Add" }) as HTMLButtonElement).disabled,
    ).toBe(true);
    await screen.findByRole("checkbox", { name: "Saved task" });
    expect(screen.queryByText("Early task")).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify([{ text: "Saved task", done: false }]),
    );
  });

  it("restores tasks and completion state from localStorage", async () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { text: "Open task", done: false },
        { text: "Finished task", done: true },
      ]),
    );

    await renderHome();

    expect(screen.getByRole("checkbox", { name: "Open task" })).toBeDefined();
    expect(
      (screen.getByRole("checkbox", { name: "Finished task" }) as HTMLInputElement)
        .checked,
    ).toBe(true);
    expect(screen.getByText("1 of 2 tasks remaining")).toBeDefined();
  });

  it("persists newly added and toggled tasks", async () => {
    await renderHome();

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "Persist me" } });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Persist me" }));

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify([{ text: "Persist me", done: true }]),
    );
  });

  it("ignores malformed saved data and filters malformed task entries", async () => {
    window.localStorage.setItem(STORAGE_KEY, "not valid json");
    const { unmount } = render(<Home />);
    await waitFor(() => {
      expect(screen.queryByText("Loading tasks...")).toBeNull();
    });

    expect(
      screen.getByText("Nothing here yet — add your first task."),
    ).toBeDefined();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("[]");

    unmount();
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { text: "Valid task", done: false },
        { text: "Wrong completion", done: "yes" },
        null,
      ]),
    );
    await renderHome();

    expect(screen.getByRole("checkbox", { name: "Valid task" })).toBeDefined();
    expect(screen.queryByText("Wrong completion")).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
      JSON.stringify([{ text: "Valid task", done: false }]),
    );
  });

  it("handles unavailable localStorage while keeping the todo list usable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Storage unavailable");
    });

    await renderHome();

    fireEvent.change(screen.getByPlaceholderText("What needs to be done?"), {
      target: { value: "In memory" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(screen.getByRole("checkbox", { name: "In memory" })).toBeDefined();
  });

  it("synchronizes updates from other tabs and ignores unrelated storage keys", async () => {
    render(<Home />);
    await screen.findByText("Nothing here yet — add your first task.");

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "another-key",
          newValue: JSON.stringify([{ text: "Ignored", done: false }]),
        }),
      );
    });
    expect(screen.queryByText("Ignored")).toBeNull();

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: JSON.stringify([{ text: "From another tab", done: true }]),
        }),
      );
    });
    expect(
      (screen.getByRole("checkbox", { name: "From another tab" }) as HTMLInputElement)
        .checked,
    ).toBe(true);

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: null }),
      );
    });
    expect(
      screen.getByText("Nothing here yet — add your first task."),
    ).toBeDefined();

    act(() => {
      window.dispatchEvent(
        new StorageEvent("storage", { key: null, newValue: null }),
      );
    });
    expect(
      screen.getByText("Nothing here yet — add your first task."),
    ).toBeDefined();
  });
});
