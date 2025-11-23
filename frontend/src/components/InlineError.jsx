// src/components/InlineError.jsx
import React from "react";

export default function InlineError({ message }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}
