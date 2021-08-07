/* eslint-disable no-restricted-syntax */
import { useEffect } from 'react';
import { OnLoadParams } from 'react-flow-renderer';

import { SetElements, Outputs } from './index.types';

export default function useVisualizationEngine({
  outputs, setElements, reactFlowInstance,
}: { outputs: Outputs, setElements: SetElements, reactFlowInstance: OnLoadParams | undefined }) {
  const runVisualization = async () => {
    if (!reactFlowInstance) {
      return;
    }

    for (const [key, value] of Object.entries(outputs)) {
      // Graphs will not be created when results key is in output
      if (key === 'results') {
        return;
      }

      const splitKey = key.split('-');
      const BLOCK_ID_IN_FLOW = splitKey[2];

      const position = reactFlowInstance.project({ x: 100, y: 100 });

      const newNode: any = {
        id: key,
        type: 'visualizationBlock',
        position,
        data: value,
      };

      const edge: any = {
        source: BLOCK_ID_IN_FLOW,
        sourceHandle: `output_${BLOCK_ID_IN_FLOW}`,
        target: key,
        targetHandle: `input_${key}`,
        type: 'visualizationEdge',
        id: `reactflow__edge-${key}output_id${BLOCK_ID_IN_FLOW}-2input_id${key}`,
      };

      setElements((es: any) => {
        let idExists = false;
        for (const tempElem of es) {
          if (tempElem.id === key) {
            idExists = true;
          }
        }

        if (idExists) {
          return es.map((el: any) => {
            if (el?.id === key) {
              // eslint-disable-next-line no-param-reassign
              el.data = value;
            }

            return el;
          });
        }
        return es.concat([newNode, edge]);
      });
    }
  };

  useEffect(() => {
    runVisualization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs]);

  return {};
}
