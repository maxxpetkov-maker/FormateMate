import React from "react";

function CopyButton({ text }) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(text)}
      className="ml-2 px-2 py-0.5 text-xs bg-blue-100 rounded hover:bg-blue-200 transition"
    >
      Copy
    </button>
  );
}

export default function CitationResult({ citation }) {
  return (
    <div className="w-full max-w-xl mt-8 bg-white/90 px-6 py-4 rounded-lg shadow">
      <h2 className="font-semibold mb-2 text-lg">In-text Citations</h2>
      <ul className="mb-4 space-y-2">
        <li>
          <b>APA:</b> {citation.apa}
        </li>
        <li>
          <b>MLA:</b> {citation.mla}
        </li>
        <li>
          <b>Chicago:</b> {citation.chicago}
        </li>
      </ul>
      <h2 className="font-semibold mb-2 text-lg">Bibliography</h2>
      <ul className="space-y-2">
        <li>
          <b>APA:</b> <span>{citation.apaBib}</span>
          <CopyButton text={citation.apaBib} />
        </li>
        <li>
          <b>MLA:</b> <span>{citation.mlaBib}</span>
          <CopyButton text={citation.mlaBib} />
        </li>
        <li>
          <b>Chicago:</b> <span>{citation.chicagoBib}</span>
          <CopyButton text={citation.chicagoBib} />
        </li>
      </ul>
    </div>
  );
}
