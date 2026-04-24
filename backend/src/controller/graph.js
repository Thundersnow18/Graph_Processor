const { parseGraphData } = require('../services/graphParser');
const { buildHierarchies } = require('../services/treeBuilder');

const processGraph = (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid input. Expected JSON with 'data' array." });
    }

    // 1. Parse and validate edges
    const { invalid_entries, duplicate_edges, valid_edges } = parseGraphData(data);

    // 2. Build hierarchies, detect cycles, find depths
    const { hierarchies, summary } = buildHierarchies(valid_edges);

    // 3. Construct final response
    const response = {
      user_id: "Abhinav_S_30112005", // Replace with desired fullname_ddmmyyyy
      email_id: "as9477@srmist.edu.in",
      college_roll_number: "RA2311030020011",
      hierarchies,
      invalid_entries,
      duplicate_edges,
      summary
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error processing graph:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  processGraph
};
