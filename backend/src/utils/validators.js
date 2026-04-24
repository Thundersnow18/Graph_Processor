const isValidEdgeFormat = (str) => {
  if (typeof str !== 'string') return false;
  const trimmed = str.trim();
  const regex = /^[A-Z]->[A-Z]$/;
  
  if (!regex.test(trimmed)) {
    return false;
  }
  
  const [parent, child] = trimmed.split('->');
  if (parent === child) {
    return false; // self-loop is invalid
  }
  
  return true;
};

module.exports = {
  isValidEdgeFormat
};
