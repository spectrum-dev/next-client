import { useEffect } from 'react';
import {
  OnLoadParams,
} from 'react-flow-renderer';

import {
  SetElements, Outputs,
  Edge, VisualizationNode,
} from './index.types';

export default function useVisualizationEngine({
  outputs, setElements, reactFlowInstance,
}: { outputs: Outputs, setElements: SetElements, reactFlowInstance: OnLoadParams | undefined }) {
  const runVisualization = async () => {
    if (!reactFlowInstance) {
      return;
    }

    for (const [key, value] of Object.entries(outputs)) {
      // A graph for the results key (in the outputs response) will not be created
      if (key === 'results') {
        return;
      }

      const splitKey = key.split('-');
      const BLOCK_ID_IN_FLOW = splitKey[2];

      // Backtest data is kept in the results drawer, so we shouldn't generate graphs here
      if (splitKey[0] === 'STRATEGY_BLOCK') {
        return;
      }

      const position = reactFlowInstance.project({ x: 100, y: 100 });

      const newNode: VisualizationNode = {
        id: key,
        type: 'visualizationBlock',
        position,
        data: value,
      };

      const edge: Edge = {
        source: BLOCK_ID_IN_FLOW,
        sourceHandle: `output_${BLOCK_ID_IN_FLOW}`,
        target: key,
        targetHandle: `input_${key}`,
        type: 'visualizationEdge',
        id: `reactflow__edge-${key}output_id${BLOCK_ID_IN_FLOW}-2input_id${key}`,
      };

      setElements((es) => {
        let idExists = false;
        for (const tempElem of es) {
          if (tempElem.id === key) {
            idExists = true;
          }
        }

        if (idExists) {
          return es.map((el) => {
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
