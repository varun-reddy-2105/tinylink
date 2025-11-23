import { useState } from "react";
import { createShortLink } from "../api";
import "../styles/ShortenerForm.css";

export default function ShortenerForm({ onShorten }) {
  const [targetUrl, setTargetUrl] = useState("");

  const handleSubmit = async () => {
    if (!targetUrl.trim()) return;
    const data = await createShortLink(targetUrl);
    onShorten(data.shortUrl);
    setTargetUrl("");
  };

  return (
    <div className="form-card">
      <h2>Shorten Your URL</h2>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={targetUrl}
        onChange={(e) => setTargetUrl(e.target.value)}
      />

      <button onClick={handleSubmit}>
        Create Short Link
      </button>
    </div>
  );
}
