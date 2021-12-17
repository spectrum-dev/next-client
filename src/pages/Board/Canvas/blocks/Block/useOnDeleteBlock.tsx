import { useContext } from 'react';
import {
  removeElements, isNode, isEdge, Elements,
} from 'react-flow-renderer';

import CanvasContext from 'app/contexts/canvas';

export default function useOnDeleteBlock({ id }: { id: string }) {
  const { setElements, setInputs, setOutputs } = useContext(CanvasContext);

  const onDeleteBlock = () => {
    setElements((els) => {
      // Find Elements
      const elementsToRemove: Elements<any> = [];
      for (const el of els) {
        // Node
        if (isNode(el)) {
          const splitId = el.id.split('-');

          if (splitId.length === 3) {
            // Checks for connected visualization blocks
            if (splitId[2] === id) {
              elementsToRemove.push(el);
            }
          } else if (splitId.length === 1) {
            // Checks for flow blocks
            if (el.id === id) {
              elementsToRemove.push(el);
            }
          }
        }

        // Edge
        if (isEdge(el)) {
          // Checks for edges
          if (el.source === id) {
            elementsToRemove.push(el);
          }
        }
      }

      // Iterates through inputs and updates the inputs payload
      setInputs((inps) => {
        const updatedInputs = {};
        for (const inp of Object.keys(inps)) {
          let isFound = false;
          for (const elem of elementsToRemove) {
            if (elem.id === inp) {
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            // @ts-ignore
            updatedInputs[inp] = inps[inp];
          }
        }
        return updatedInputs;
      });

      // Iterates through outputs and updates the outputs payload
      setOutputs((outputs) => {
        const updatedOutputs = {};
        for (const output of Object.keys(outputs)) {
          let isFound = false;
          for (const elem of elementsToRemove) {
            if (elem.id === output) {
              isFound = true;
              break;
            }
          }
          if (!isFound) {
            // @ts-ignore
            updatedInputs[output] = outputs[output];
          }
        }
        return updatedOutputs;
      });

      return removeElements(elementsToRemove, els);
    });
  };
  return { onDeleteBlock };
}
