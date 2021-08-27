import {
  Elements, Edge, isNode, isEdge,
} from 'react-flow-renderer';

const NON_NODE_OR_EDGE_VALUE = 'There was an error validating this strategy. Please try again.';

export const getNodeAndEdgeList = (els: Elements, inputs: any) => {
  const nodeList: any = {};
  const edgeList: Array<Edge> = [];

  for (const element of els) {
    if (isNode(element)) {
      if (element?.id.split('-').length === 1) {
        nodeList[element.id] = inputs[element.id];
      }
    } else if (isEdge(element)) {
      if (element.target.split('-').length === 1) {
        edgeList.push(element);
      }
    } else {
      throw new Error(NON_NODE_OR_EDGE_VALUE);
    }
  }

  return { nodeList, edgeList };
};
