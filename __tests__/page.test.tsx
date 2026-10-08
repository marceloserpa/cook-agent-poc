import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "../app/page";

afterEach(() => {
  cleanup();
});

describe("Todo List", () => {
  it("shows the initial empty state and disables Add for an empty input", () => {
    render(<Home />);

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

  it("does not add a blank or whitespace-only task", () => {
    render(<Home />);

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

  it("trims and adds a task, then clears the input", () => {
    render(<Home />);

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

  it("toggles completion and updates the remaining-task count", () => {
    render(<Home />);

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
});
