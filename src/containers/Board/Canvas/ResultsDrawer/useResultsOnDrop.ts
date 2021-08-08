import {
  Node, Elements, FlowElement, isNode, OnLoadParams,
} from 'react-flow-renderer';

import { SetElements } from 'containers/Board/Canvas/index.types';

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
    const newNode: Node = {
      id: `RESULTS-${label}`,
      type: 'resultBlock',
      position,
      data: { label },
    };

    setElements((es: Elements) => {
      let isExists = false;
      const updatedElements = es.map((el: FlowElement) => {
        if (isNode(el) && el.id === newNode.id) {
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
