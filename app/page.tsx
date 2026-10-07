"use client";

import { useState } from "react";

type Task = {
  text: string;
  done: boolean;
};

export default function Home() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const remaining = tasks.filter((t) => !t.done).length;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim() !== "") {
      setTasks((prevTasks) => [...prevTasks, { text: task.trim(), done: false }]);
      setTask("");
    }
  };

  const toggleTask = (index: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <div className="flex flex-1 items-start justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-16 font-sans sm:py-24 dark:from-zinc-950 dark:via-black dark:to-zinc-900">
      <main className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-xl shadow-indigo-100/50 backdrop-blur sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Todo List
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {tasks.length === 0
              ? "Nothing here yet — add your first task."
              : `${remaining} of ${tasks.length} task${tasks.length === 1 ? "" : "s"} remaining`}
          </p>
        </header>

        <form onSubmit={handleAddTask} className="flex items-center gap-2">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="What needs to be done?"
          />
          <button
            type="submit"
            disabled={task.trim() === ""}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </form>

        {tasks.length > 0 && (
          <ul className="mt-6 divide-y divide-zinc-100 overflow-hidden rounded-lg border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {tasks.map((t, index) => (
              <li key={index}>
                <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => toggleTask(index)}
                    className="h-5 w-5 cursor-pointer rounded accent-indigo-600"
                  />
                  <span
                    className={`flex-1 break-words transition ${
                      t.done
                        ? "text-zinc-400 line-through dark:text-zinc-500"
                        : "text-zinc-800 dark:text-zinc-100"
                    }`}
                  >
                    {t.text}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
