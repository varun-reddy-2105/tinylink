import { useState } from "react";
import ShortenerForm from "../components/ShortenerForm";
import LinkOutput from "../components/LinkOutput";
import "../styles/globals.css";

export default function Home() {
  const [shortUrl, setShortUrl] = useState("");

  return (
    <div className="container">
      <ShortenerForm onShorten={setShortUrl} />
      <LinkOutput link={shortUrl} />
    </div>
  );
}
