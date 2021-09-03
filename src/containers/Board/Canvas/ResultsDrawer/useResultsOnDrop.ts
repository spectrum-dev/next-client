import {
  FlowElement, OnLoadParams,
} from 'react-flow-renderer';

import { SetElements, ResultsNode, isResultsNode } from 'containers/Board/Canvas/index.types';

export default function useResultsOnDrop() {
  const onDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    reactFlowInstance: OnLoadParams | undefined,
    setElements: SetElements,
  ) => {
    if (!reactFlowInstance) {
      return;
    }

    const label = event.dataTransfer.getData('application/reactflow-data-label');
    const flowBlockType = event.dataTransfer.getData('application/reactflow-flow-block-type');

    if (flowBlockType === 'baseBlock') {
      return;
    }

    const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
    const newNode: ResultsNode = {
      id: `RESULTS-${flowBlockType}-${label}`,
      type: flowBlockType,
      position,
      data: { label },
    };

    setElements((es) => {
      let isExists = false;
      const updatedElements = es.map((el: FlowElement) => {
        if (isResultsNode(el) && el.id === newNode.id) {
          isExists = true;
          return newNode;
        }
        return el;
      });

      if (!isExists) {
        return updatedElements.concat([newNode]);
      }
      return updatedElements;
    });
  };

  return { onDrop };
}
