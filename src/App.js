import React, { useState } from "react";
import CitationResult from "./components/CitationResult";
import fetchMetadata from "./utils/fetchMetadata";
import Cite from "citation-js";

export default function App() {
  const [input, setInput] = useState("");
  const [citation, setCitation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");
    setCitation(null);
    setLoading(true);
    try {
      const metadata = await fetchMetadata(input);
      if (!metadata) throw new Error("Could not fetch metadata.");
      const cite = new Cite(metadata);
      setCitation({
        apa: cite.format("citation", { template: "apa", lang: "en-US" }),
        mla: cite.format("citation", { template: "mla", lang: "en-US" }),
        chicago: cite.format("citation", { template: "chicago", lang: "en-US" }),
        apaBib: cite.format("bibliography", { template: "apa", lang: "en-US" }),
        mlaBib: cite.format("bibliography", { template: "mla", lang: "en-US" }),
        chicagoBib: cite.format("bibliography", { template: "chicago", lang: "en-US" }),
      });
    } catch (err) {
      setError("Sorry, we couldn't get the citation. Please check your input.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-calm p-4">
      <h1 className="text-3xl font-bold my-8 text-blue-800">CiteMate</h1>
      <form
        onSubmit={handleGenerate}
        className="w-full max-w-xl flex flex-col items-center gap-4 bg-white/80 p-6 rounded-xl shadow"
      >
        <input
          type="text"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          placeholder="Paste URL, DOI, or ISBN here…"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-800 transition"
          disabled={loading}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </form>
      {error && (
        <div className="mt-6 text-red-600 font-medium">{error}</div>
      )}
      {citation && <CitationResult citation={citation} />}
      <footer className="mt-16 text-gray-400 text-sm">
        Made for students, by students.
      </footer>
    </div>
  );
}
