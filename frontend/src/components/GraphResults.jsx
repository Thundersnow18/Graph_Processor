import React from 'react';

const GraphResults = ({ result }) => {
  if (!result) return null;

  const { hierarchies, invalid_entries, duplicate_edges, summary, user_id, email_id, college_roll_number } = result;

  return (
    <div className="results-section">
      <div className="card">
        <h3>User Details</h3>
        <p><strong>User ID:</strong> {user_id}</p>
        <p><strong>Email:</strong> {email_id}</p>
        <p><strong>Roll Number:</strong> {college_roll_number}</p>
      </div>

      <div className="card">
        <h3>Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-value">{summary.total_trees}</span>
            <span className="summary-label">Total Trees</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{summary.total_cycles}</span>
            <span className="summary-label">Total Cycles</span>
          </div>
          <div className="summary-item">
            <span className="summary-value">{summary.largest_tree_root || "None"}</span>
            <span className="summary-label">Largest Tree Root</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Hierarchies</h3>
        {hierarchies && hierarchies.length > 0 ? (
          <div className="tree-view">
            <pre>{JSON.stringify(hierarchies, null, 2)}</pre>
          </div>
        ) : (
          <p>No valid trees found.</p>
        )}
      </div>

      {(invalid_entries && invalid_entries.length > 0) && (
        <div className="card">
          <h3>Invalid Entries</h3>
          <div className="badges">
            {invalid_entries.map((entry, idx) => (
              <span key={idx} className="badge invalid">{entry}</span>
            ))}
          </div>
        </div>
      )}

      {(duplicate_edges && duplicate_edges.length > 0) && (
        <div className="card">
          <h3>Duplicate Edges</h3>
          <div className="badges">
            {duplicate_edges.map((edge, idx) => (
              <span key={idx} className="badge duplicate">{edge}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphResults;
