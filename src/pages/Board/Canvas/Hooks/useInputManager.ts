import { useState, useEffect } from 'react';
import { isNode } from 'react-flow-renderer';

import { formatDate } from 'app/utils';

import fetcher from 'app/fetcher';

// Types
import {
  Inputs, BlockType, Elements, NodeMetadataInputs,
  isFormNode,
} from '../index.types';

interface FieldDataResponse {
  response: Array<string>;
}

export default function useInputManager(
  { elements, loadedInputs, isStrategyLoaded }:
  { elements: Elements, loadedInputs: Inputs, isStrategyLoaded: boolean },
) {
  const [initializer, setInitializer] = useState<boolean>(false);
  const [inputs, setInputs] = useState<Inputs>({});
  const [startId, setStartId] = useState<number>(0);

  const handleInputByType = async (
    inputFieldType: string,
    input: NodeMetadataInputs,
    blockType: BlockType,
    blockId: number,
  ) => {
    switch (inputFieldType) {
      case 'search':
        return {
          [input.fieldVariableName]: {
            options: [],
            value: '',
          },
        };
      case 'dropdown':
        // TODO: Remove the API Endpoints When Fully Deprecated
        if ('data' in input.fieldData) {
          return {
            [input.fieldVariableName]: {
              options: input.fieldData.data,
              value: '',
            },
          };
        } else {
          // eslint-disable-next-line no-case-declarations
          const fieldDataResponse = await fetcher(`/orchestration/${blockType}/${blockId}${input.fieldData.base}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          });

          if (fieldDataResponse.status === 200) {
            const response: FieldDataResponse = fieldDataResponse.data;

            if ('onChange' in input.fieldData) {
              return {
                [input.fieldVariableName]: {
                  options: response.response,
                  value: '',
                  onChange: input.fieldData.onChange,
                },
              };
            }
            return {
              [input.fieldVariableName]: {
                options: response.response,
                value: '',
              },
            };
          }
        }
        break;
      case 'input':
        return {
          [input.fieldVariableName]: {
            value: '',
          },
        };
      case 'date_range':
        // eslint-disable-next-line no-case-declarations
        const currentDate = new Date();

        if (!('fieldVariableNames' in input) || !(input.fieldVariableNames)) {
          // fieldVariableNames not in input or value is undefined
          break;
        }

        return {
          [input.fieldVariableNames[0]]: {
            rawValue: currentDate,
            value: formatDate(currentDate),
          },
          [input.fieldVariableNames[1]]: {
            rawValue: currentDate,
            value: formatDate(currentDate),
          },
        };
      case 'inputs_from_connection':
        return {
          [input.fieldVariableName]: {
            inputFromConnectionValue: '',
            value: '',
          },
        };
      default:
        break;
    }
    return {};
  };

  const startIdCalculator = (inputObject: Inputs): number => Math.max(
    ...Object.keys(inputObject).map((i) => {
      if (i.split('-').length === 1) {
        return Number(i);
      }
      return 0;
    }),
  );

  const extractInputs = async () => {
    let mergedInputs: Inputs | {} = {};
    for (const element of elements) {
      if (
        isFormNode(element)
        && (element.id.split('-').length === 1)
      ) {
        const { id, data } = element;

        mergedInputs = {
          ...mergedInputs,
          [id]: {
            blockType: data?.metadata.blockType,
            blockId: data?.metadata.blockId,
          },
        };

        if (data?.metadata.inputs) {
          for (const input of data.metadata.inputs) {
            // eslint-disable-next-line no-await-in-loop
            const inputValue = await handleInputByType(
              input.fieldType,
              input,
              data.metadata.blockType,
              data.metadata.blockId,
            );

            mergedInputs = {
              ...mergedInputs,
              [id]: {
                // @ts-ignore
                ...mergedInputs?.[id],
                ...inputValue,
              },
            };
          }
        }
      } else if (
        isNode(element)
        && (element.id.split('-').length === 3)
      ) {
        const { id } = element;
        mergedInputs = {
          ...mergedInputs,
          [id]: {
            dataKey: undefined,
            dataKeys: undefined,
            yValue: '',
            graphType: undefined,
          },
        };
      }
    }

    setInputs((elems) => {
      const response = {
        ...mergedInputs,
        ...elems,
      };

      setStartId(startIdCalculator(response));

      return response;
    });
  };

  useEffect(() => {
    if (isStrategyLoaded) {
      if (!initializer) {
        setInputs(() => {
          if (loadedInputs) {
            if (Object.keys(loadedInputs).length > 0) {
              setStartId(startIdCalculator(loadedInputs));
            }
            setInitializer(true);
            return loadedInputs;
          }
          return {};
        });
      } else {
        extractInputs();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedInputs, elements.length, isStrategyLoaded]);

  return { inputs, setInputs, startId };
}
