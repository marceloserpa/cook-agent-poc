"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center gap-4 py-32 px-16 bg-white dark:bg-black">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full max-w-sm rounded-full border border-black/[.08] px-5 py-3 text-black outline-none focus:border-black/[.24] dark:border-white/[.145] dark:text-white dark:focus:border-white/[.3]"
        />
        <button
          type="button"
          onClick={() => console.log(name)}
          className="flex h-12 w-full max-w-sm items-center justify-center rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Submit
        </button>
      </main>
    </div>
  );
}
