"use client";

import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

type Props = {
  hex: string;
  label?: string;
};

export default function ColorSwatch({ hex, label }: Props) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-3 p-2 bg-white rounded shadow-sm">
      <div
        className="w-12 h-12 rounded"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <div className="flex-1">
        <div className="font-mono text-sm text-gray-800">{hex.toUpperCase()}</div>
        {label && <div className="text-xs text-gray-500">{label}</div>}
      </div>
      <CopyToClipboard text={hex} onCopy={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
        <button className="px-3 py-1 bg-indigo-600 text-white text-sm rounded">
          {copied ? "Copied!" : "Copy"}
        </button>
      </CopyToClipboard>
    </div>
  );
}
