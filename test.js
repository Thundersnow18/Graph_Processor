const { parseGraphData } = require('./backend/src/services/graphParser');
const { buildHierarchies } = require('./backend/src/services/treeBuilder');

const data = ["A->B", "A->C", "B->D"];
const { invalid_entries, duplicate_edges, valid_edges } = parseGraphData(data);
const { hierarchies, summary } = buildHierarchies(valid_edges);

console.log(JSON.stringify({ hierarchies, summary }, null, 2));
