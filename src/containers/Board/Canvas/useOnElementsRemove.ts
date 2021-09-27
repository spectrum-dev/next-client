/* eslint-disable @typescript-eslint/no-unused-vars */
import { removeElements, isNode } from 'react-flow-renderer';

import { Elements, SetElements, SetInputs } from './index.types';

export default function useOnElementsRemove(
  { setElements, setInputs }:
  { setElements: SetElements, setInputs: SetInputs }, // TODO: This needs to be changed
) {
  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => {
      // Removes the graph associated with a block if the flowBlock is deleted
      if (elementsToRemove.length === 1 || elementsToRemove.length === 2) {
        const elementId = elementsToRemove[0].id;
        if (elementId.split('-').length === 1) {
          for (const el of els) {
            const elSplit = el.id.split('-');
            if (isNode(el) && elSplit.length === 3) {
              if (elSplit[2] === elementId) {
                elementsToRemove.push(el);
              }
            }
          }
        }
      }

      // // TODO: Implement Logic for Removing Input Keys
      // setInputs((inps) => {
      //   let updatedInps = {};

      //   for (const inp of Object.keys(inps)) {
      //     for (const el of elementsToRemove) {
      //       console.log('Input ID: ', inp);
      //       console.log('Element ID: ', el.id);
      //       if (isNode(el) && inp === el.id) {
      //         updatedInps = {
      //           ...updatedInps,
      //           [el.id]: inps[inp],
      //         };
      //       }
      //     }
      //   }

      //   console.log('Updated Inputs: ', updatedInps);
      //   return updatedInps;
      // });

      return removeElements(elementsToRemove, els);
    });
  };

  return { onElementsRemove };
}
