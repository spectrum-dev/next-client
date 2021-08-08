export default function useResultsOnDrop() {
  const onDrop = async (event: any, reactFlowInstance: any, setElements: any) => {
    const label = event.dataTransfer.getData('application/reactflow-data-label');
    const flowBlockType = event.dataTransfer.getData('application/reactflow-flow-block-type');

    if (flowBlockType === 'baseBlock') {
      return;
    }

    const position = reactFlowInstance.project({ x: event.clientX, y: event.clientY - 40 });
    const newNode: any = {
      id: `RESULTS-${label}`,
      type: 'resultBlock',
      position,
      data: { label },
    };

    setElements((es: any) => es.concat(newNode));
  };

  return { onDrop };
}
