"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

type Props = {
  onFileDataUrl: (dataUrl: string, fileName?: string) => void;
};

export default function ImageDropzone({ onFileDataUrl }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onFileDataUrl(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  }, [onFileDataUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="w-full max-w-xl mx-auto p-6 border-2 border-dashed rounded-lg cursor-pointer hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
      aria-label="Upload an image"
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <p className="text-gray-700">
          {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
        </p>
        <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF — try a colorful photo!</p>
      </div>
    </div>
  );
}
