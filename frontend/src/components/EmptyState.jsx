// src/components/EmptyState.jsx
import React from "react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔗</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
