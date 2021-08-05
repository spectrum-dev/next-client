import { useState } from 'react';

export default function useResultsOnDrop() {
  const [id, setId] = useState<number>(1);

  const generateID = () => {
    setId(id + 1);
    return id.toString();
  };

  const onDrop = async (event: any, reactFlowInstance: any, setElements: any) => {
    // Extracts data from headers
    const label = event.dataTransfer.getData('application/reactflow-data-label');
    // const value = event.dataTransfer.getData('application/reactflow-data-value');
    // const type = event.dataTransfer.getData('application/reactflow-data-type');

    const flowBlockType = event.dataTransfer.getData('application/reactflow-flow-block-type');

    if (flowBlockType === 'baseBlock') {
      return;
    }

    const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
    const newNode: any = {
      id: `RESULTS-${generateID()}`,
      type: 'resultBlock',
      position,
      data: { label },
    };

    setElements((es: any) => es.concat(newNode));
  };

  return { onDrop };
}
