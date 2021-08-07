/* eslint-disable no-case-declarations */
import { useState, useEffect } from 'react';
import { isNode, Elements } from 'react-flow-renderer';

import { formatDate } from 'app/utils';

import fetcher from 'app/fetcher';

// Types
import { Inputs } from './index.types';

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
    inputFieldType: string, input: Record<string, any>, blockType: string, blockId: string,
  ) => {
    switch (inputFieldType) {
      case 'search':
        return {
          [input?.fieldVariableName]: {
            options: [],
            value: '',
          },
        };
      case 'dropdown':
        const fieldDataResponse = await fetcher(`/orchestration/${blockType}/${blockId}${input?.fieldData?.base}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (fieldDataResponse.status === 200) {
          const response: FieldDataResponse = fieldDataResponse.data;

          if ('onChange' in input?.fieldData) {
            return {
              [input?.fieldVariableName]: {
                options: response.response,
                value: '',
                onChange: input?.fieldData?.onChange,
              },
            };
          }
          return {
            [input?.fieldVariableName]: {
              options: response.response,
              value: '',
            },
          };
        }
        break;
      case 'input':
        return {
          [input?.fieldVariableName]: {
            value: '',
          },
        };
      case 'date_range':
        const currentDate = new Date();
        return {
          [input?.fieldVariableNames[0]]: {
            rawValue: currentDate,
            value: formatDate(currentDate),
          },
          [input?.fieldVariableNames[1]]: {
            rawValue: currentDate,
            value: formatDate(currentDate),
          },
        };
      default:
        break;
    }
    return {};
  };

  const startIdCalculator = (responseObject: any): number => Math.max(
    ...Object.keys(responseObject).map((i) => {
      if (i.split('-').length === 1) {
        return Number(i);
      }
      return 0;
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const extractInputs = async () => {
    let mergedInputs: Inputs | {} = {};
    for (const element of elements) {
      if (
        isNode(element)
        && (element.id.split('-').length === 1)
      ) {
        if (!(inputs[element.id])) {
          let inputValues = {};
          for (const input of element.data.metadata.inputs) {
            // eslint-disable-next-line no-await-in-loop
            const inputValue = await handleInputByType(
              input.fieldType,
              input,
              element.data.metadata.blockType,
              element.data.metadata.blockId,
            );

            inputValues = {
              ...inputValues,
              ...inputValue,
            };
          }

          mergedInputs = {
            ...mergedInputs,
            [element.id]: {
              blockType: element.data.metadata.blockType,
              blockId: element.data.metadata.blockId,
              ...inputValues,
            },
          };
        }
      } else if (
        isNode(element)
        && (element.id.split('-').length === 3)
      ) {
        mergedInputs = {
          ...mergedInputs,
          [element.id]: {
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
