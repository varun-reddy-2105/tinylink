import "../styles/LinkOutput.css";

export default function LinkOutput({ link }) {
  if (!link) return null;

  return (
    <div className="output-card">
      <p>Your TinyLink:</p>
      <a href={link} target="_blank" rel="noreferrer">
        {link}
      </a>
    </div>
  );
}
