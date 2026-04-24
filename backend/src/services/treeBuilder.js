const buildHierarchies = (valid_edges) => {
  const adj = new Map();
  const inDegree = new Map();
  const allNodes = new Set();

  for (let edge of valid_edges) {
    const { parent, child } = edge;
    allNodes.add(parent);
    allNodes.add(child);
    
    if (!adj.has(parent)) adj.set(parent, []);
    adj.get(parent).push(child);
    
    if (!inDegree.has(child)) inDegree.set(child, 0);
    inDegree.set(child, inDegree.get(child) + 1);
    
    if (!inDegree.has(parent)) inDegree.set(parent, 0);
  }

  const hierarchies = [];
  const visited = new Set();
  
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let max_depth = 0;

  // Function to build tree and calculate depth
  const traverseTree = (node) => {
    visited.add(node);
    const children = adj.get(node) || [];
    const treeObj = {};
    let node_depth = 1;

    for (let child of children) {
      const childData = traverseTree(child);
      treeObj[child] = childData.tree;
      node_depth = Math.max(node_depth, 1 + childData.depth);
    }

    return { tree: treeObj, depth: node_depth };
  };

  // Find all roots (in-degree 0)
  const roots = [];
  for (let node of allNodes) {
    if (inDegree.get(node) === 0) {
      roots.push(node);
    }
  }

  // Sort roots to process deterministically, though not strictly required
  roots.sort();

  for (let root of roots) {
    const { tree, depth } = traverseTree(root);
    hierarchies.push({
      root,
      tree,
      depth
    });
    total_trees++;

    if (depth > max_depth) {
      max_depth = depth;
      largest_tree_root = root;
    } else if (depth === max_depth && largest_tree_root !== "") {
      if (root < largest_tree_root) {
        largest_tree_root = root;
      }
    } else if (max_depth === 0) {
      // In case of single node trees if any, though our edges have 2 nodes min.
      max_depth = depth;
      largest_tree_root = root;
    }
  }

  // Find components with cycles: Undirected BFS
  const unvisitedNodes = Array.from(allNodes).filter(n => !visited.has(n));
  
  // Build undirected adj for component finding
  const undirAdj = new Map();
  for (let edge of valid_edges) {
    const { parent, child } = edge;
    if (!undirAdj.has(parent)) undirAdj.set(parent, []);
    if (!undirAdj.has(child)) undirAdj.set(child, []);
    undirAdj.get(parent).push(child);
    undirAdj.get(child).push(parent);
  }

  const unvisitedSet = new Set(unvisitedNodes);
  while (unvisitedSet.size > 0) {
    // Find lexicographically smallest node in the REMAINING unvisited set
    let smallest = null;
    for (let node of unvisitedSet) {
      if (smallest === null || node < smallest) {
        smallest = node;
      }
    }

    // Now find the lexicographically smallest node in this ENTIRE weakly connected component
    const q = [smallest];
    unvisitedSet.delete(smallest);
    
    let compSmallest = smallest;
    let head = 0;
    while (head < q.length) {
      const curr = q[head++];
      if (curr < compSmallest) {
        compSmallest = curr;
      }
      
      const neighbors = undirAdj.get(curr) || [];
      for (let neighbor of neighbors) {
        if (unvisitedSet.has(neighbor)) {
          unvisitedSet.delete(neighbor);
          q.push(neighbor);
        }
      }
    }

    hierarchies.push({
      root: compSmallest,
      tree: {},
      has_cycle: true
    });
    total_cycles++;
  }

  const summary = {
    total_trees,
    total_cycles,
    largest_tree_root: largest_tree_root || null
  };

  return { hierarchies, summary };
};

module.exports = {
  buildHierarchies
};
