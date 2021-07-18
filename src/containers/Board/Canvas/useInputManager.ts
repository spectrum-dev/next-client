/* eslint-disable no-case-declarations */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import { isNode } from 'react-flow-renderer';

import { formatDate } from 'app/utils';

import fetcher from 'app/fetcher';

export default function useInputManager(
  { elements, loadedInputs, isStrategyLoaded }:
  { elements: Array<Record<any, any>>, loadedInputs: Record<any, any>, isStrategyLoaded: boolean },
) {
  const [initializer, setInitializer] = useState<Boolean>(false);
  const [inputs, setInputs] = useState({});
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
        const fieldData = await fetcher(`/orchestration/${blockType}/${blockId}${input?.fieldData?.base}`);

        if (fieldData.status === 200) {
          if (input?.fieldData?.hasOwnProperty('onChange')) {
            return {
              [input?.fieldVariableName]: {
                options: fieldData.data.response,
                value: '',
                onChange: input?.fieldData?.onChange,
              },
            };
          }
          return {
            // @ts-ignore
            [input?.fieldVariableName]: {
              options: fieldData.data.response,
              value: '',
            },
          };
        }
        console.error('Error making remote request for dropdown data');
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
        console.error('Unhandled Input Type');
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
    let mergedInputs = {};
    for (const element of elements) {
      if (
        // @ts-ignore
        isNode(element)
        && (element?.id.split('-').length === 1)
      ) {
        // @ts-ignore
        mergedInputs[element.id] = {};
        // @ts-ignore
        mergedInputs[element.id].blockType = element?.data?.metadata?.blockType;
        // @ts-ignore
        mergedInputs[element.id].blockId = element?.data?.metadata?.blockId;
        for (const input of element?.data?.metadata?.inputs) {
          // eslint-disable-next-line no-await-in-loop
          const inputValue = await handleInputByType(
            input.fieldType,
            input,
            element?.data?.metadata?.blockType,
            element?.data?.metadata?.blockId,
          );
          // @ts-ignore
          mergedInputs = {
            ...mergedInputs,
            [element.id]: {
              // @ts-ignore
              ...mergedInputs?.[element.id],
              ...inputValue,
            },
          };
        }
      } else if (
        // @ts-ignore
        isNode(element)
        && (element?.id.split('-').length === 3)
      ) {
        // @ts-ignore
        mergedInputs[element.id] = {
          dataKey: undefined,
          dataKeys: undefined,
          yValue: '',
          graphType: undefined,
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
  }, [loadedInputs, elements, isStrategyLoaded]);

  return { inputs, setInputs, startId };
}
