const { isValidEdgeFormat } = require('../utils/validators');

const parseGraphData = (data) => {
  const invalid_entries = [];
  const duplicate_edges = [];
  const valid_edges = [];
  
  const seen_edges = new Set();
  const duplicate_set = new Set();
  const child_to_parent = new Map(); // to enforce multi-parent rule

  if (!Array.isArray(data)) {
    return { invalid_entries, duplicate_edges, valid_edges };
  }

  for (let item of data) {
    if (typeof item !== 'string' || !isValidEdgeFormat(item)) {
      invalid_entries.push(String(item));
      continue;
    }

    const trimmed = item.trim();
    
    // Check duplicates
    if (seen_edges.has(trimmed)) {
      if (!duplicate_set.has(trimmed)) {
        duplicate_edges.push(trimmed);
        duplicate_set.add(trimmed);
      }
      continue;
    }
    seen_edges.add(trimmed);

    // Multi-parent rule check
    const [parent, child] = trimmed.split('->');
    if (child_to_parent.has(child)) {
      // Ignore silently as per requirements
      continue;
    }
    
    // Register the parent for this child
    child_to_parent.set(child, parent);
    valid_edges.push({ parent, child, raw: trimmed });
  }

  return { invalid_entries, duplicate_edges, valid_edges };
};

module.exports = {
  parseGraphData
};
