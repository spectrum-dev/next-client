// @ts-nocheck
/* eslint-disable no-prototype-builtins */
import { useState, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

// Custom Components
import Select from 'components/Select';
import DateRangePicker from 'components/DateRangePicker';
import Dropdown from 'components/Dropdown';

// Utils
import fetcher from 'app/fetcher';
import { formatDate } from 'app/utils';

// Contexts
import CanvasContext from 'app/contexts/canvas';

export default function useInputFields({ id }: { id: string }) {
  const [additionalInputs, setAdditionalInputs] = useState([]);

  const { inputs, setInputs, inputDependencyGraph } = useContext(CanvasContext);

  const handleOnSearchEvent = async (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    id: string,
    blockType: string,
    blockId: string,
    url: string,
    fieldVariableName: string,
    parameter: string,
  ) => {
    try {
      const onSearchResponse = await fetcher(`/orchestration/${blockType}/${blockId}${url}${parameter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      setInputs((inp: any) => ({
        ...inp,
        [id]: {
          ...inp?.[id],
          [fieldVariableName]: {
            ...inp?.[id]?.[fieldVariableName],
            options: onSearchResponse.status === 200 ? onSearchResponse.data.response : [],
          },
        },
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnChangeEvent = async (
    // eslint-disable-next-line @typescript-eslint/no-shadow
    id: string,
    blockType: string,
    blockId: string,
    url: string,
    parameter: string,
  ) => {
    try {
      const onChangeResponse = await fetcher(`/orchestration/${blockType}/${blockId}/${url}${parameter}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (onChangeResponse.status === 200) {
        setInputs((inp: any) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let additionalInputs = {};

          for (const inputValue of onChangeResponse?.data?.response) {
            // eslint-disable-next-line no-prototype-builtins
            if (inputValue.hasOwnProperty('fieldData') && inputValue?.fieldData.hasOwnProperty('options')) {
              additionalInputs = {
                ...additionalInputs,
                [inputValue?.fieldVariableName]: {
                  options: inputValue?.fieldData?.options,
                  value: '',
                },
              };
            } else {
              additionalInputs = {
                ...additionalInputs,
                [inputValue?.fieldVariableName]: {
                  value: '',
                },
              };
            }
          }

          return {
            ...inp,
            [id]: {
              ...inp?.[id],
              ...additionalInputs,
            },
          };
        });
        setAdditionalInputs(onChangeResponse?.data?.response);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderInputField = (inputField: any) => {
    if (
      (!inputField && !inputField.fieldType)
      || (inputs && Object.keys(inputs).length === 0)
    ) {
      return <></>;
    }

    if (!inputs?.[id]) {
      return <></>;
    }

    switch (inputField.fieldType) {
      case 'input':
        return (
          <NumberInput
            value={inputs?.[id]?.[inputField.fieldVariableName]?.value}
            onChange={(value: String) => {
              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp?.[id],
                  [inputField?.fieldVariableName]: { value },
                },
              }));
            }}
            min={0}
            backgroundColor="#2D3748"
            borderColor="#2D3748"
            textColor="white"
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        );
      case 'dropdown':
        // eslint-disable-next-line no-case-declarations
        const options = [];
        // Used as in transition, as sometimes the options
        // won't exist as the metric used doesn't have any options
        if (inputs?.[id]?.[inputField?.fieldVariableName].options) {
          for (const elem of inputs?.[id]?.[inputField?.fieldVariableName].options) {
            options.push(
              <option value={elem}>
                { elem }
              </option>,
            );
          }
        }

        return (
          <Dropdown
            options={inputs?.[id]?.[inputField?.fieldVariableName].options}
            value={inputs?.[id]?.[inputField?.fieldVariableName].value}
            onChange={(selectedItem: any) => {
              // TODO: Retrieve additional metadata fields from orchestrator
              // TODO: Render those form fields inside as additional form inputs
              if (inputs?.[id]?.[inputField?.fieldVariableName]?.hasOwnProperty('onChange')) {
                handleOnChangeEvent(
                  id,
                  inputs?.[id].blockType,
                  inputs?.[id].blockId,
                  inputs?.[id]?.[inputField?.fieldVariableName]?.onChange,
                  selectedItem.value,
                );
              }

              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp[id],
                  [inputField?.fieldVariableName]: {
                    ...inp[id][inputField?.fieldVariableName],
                    value: selectedItem.value,
                  },
                },
              }));
            }}
          />
        );
      case 'search':
        return (
          <Select
            placeholder="Type here to start search"
            options={inputs?.[id]?.[inputField?.fieldVariableName].options}
            value={inputs?.[id]?.[inputField?.fieldVariableName].value}
            onInputChange={(inputtedQuery: any) => {
              if (inputtedQuery !== '') {
                handleOnSearchEvent(
                  id,
                  inputs?.[id].blockType,
                  inputs?.[id].blockId,
                  inputField?.fieldData?.base,
                  inputField?.fieldVariableName,
                  inputtedQuery,
                );
              }
            }}
            onChange={(selectedItem: any) => {
              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp[id],
                  [inputField?.fieldVariableName]: {
                    ...inp[id][inputField?.fieldVariableName],
                    value: selectedItem.value,
                  },
                },
              }));
            }}
          />
        );
      case 'date_range':
        return (
          <DateRangePicker
            startDate={inputs?.[id]?.[inputField?.fieldVariableNames[0]]?.rawValue}
            endDate={inputs?.[id]?.[inputField?.fieldVariableNames[1]]?.rawValue}
            onStartChange={(value: any) => {
              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp?.[id],
                  [inputField?.fieldVariableNames[0]]: {
                    rawValue: value,
                    value: formatDate(value),
                  },
                },
              }));
            }}
            onEndChange={(value: any) => {
              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp?.[id],
                  [inputField?.fieldVariableNames[1]]: {
                    rawValue: value,
                    value: formatDate(value),
                  },
                },
              }));
            }}
          />
        );
      case 'inputs_from_connection':
        if (!inputDependencyGraph || !inputDependencyGraph?.[id]) {
          return (
            <div>
              Connect a block to populate this field
            </div>
          );
        }

        // eslint-disable-next-line no-case-declarations
        const { inputFromConnectionValue } = inputs?.[id]?.[
          inputField?.fieldVariableName
        ];

        // eslint-disable-next-line no-case-declarations
        const dataKeyOptions = inputFromConnectionValue
          ? inputDependencyGraph?.[id]?.[inputFromConnectionValue]?.outputInterface : [];

        if (Object.keys(inputDependencyGraph?.[id]).length === 1) {
          return (
            <Box>
              <Dropdown
                options={
                  inputDependencyGraph?.[id]?.[
                    Object.keys(inputDependencyGraph?.[id])[0]
                  ]?.outputInterface
                }
                value={inputs?.[id]?.[inputField?.fieldVariableName].value}
                onChange={(selectedItem: any) => {
                  setInputs((inp: any) => ({
                    ...inp,
                    [id]: {
                      ...inp[id],
                      [inputField?.fieldVariableName]: {
                        ...inp[id][inputField?.fieldVariableName],
                        value: selectedItem.value,
                      },
                    },
                  }));
                }}
              />
            </Box>
          );
        }

        return (
          <>
            <FormLabel textColor="white" fontSize={15}>
              Block ID
            </FormLabel>
            <Box>
              <Dropdown
                options={Object.keys(inputDependencyGraph?.[id])}
                value={inputs?.[id]?.[inputField?.fieldVariableName].inputFromConnectionValue}
                onChange={(selectedItem: any) => {
                  setInputs((inp: any) => ({
                    ...inp,
                    [id]: {
                      ...inp[id],
                      [inputField?.fieldVariableName]: {
                        ...inp[id][inputField?.fieldVariableName],
                        inputFromConnectionValue: selectedItem.value,
                      },
                    },
                  }));
                }}
              />
            </Box>
            <FormLabel textColor="white" fontSize={15} marginTop={2}>
              Selected Data
            </FormLabel>
            <Box>
              <Dropdown
                options={dataKeyOptions}
                value={inputs?.[id]?.[inputField?.fieldVariableName].value}
                onChange={(selectedItem: any) => {
                  setInputs((inp: any) => ({
                    ...inp,
                    [id]: {
                      ...inp[id],
                      [inputField?.fieldVariableName]: {
                        ...inp[id][inputField?.fieldVariableName],
                        value: selectedItem.value,
                      },
                    },
                  }));
                }}
              />
            </Box>
          </>
        );
      default:
        return (
          <div>
            Field Type Not Supported
          </div>
        );
    }
  };

  const renderInputFields = (selectedInputFields: any) => {
    const formList = [];
    for (const selectedInputField of selectedInputFields) {
      formList.push(
        <FormControl key={`${id}_${selectedInputField.fieldName}_${selectedInputField.fieldName}`}>
          <FormLabel textColor="white">
            { selectedInputField.fieldName }
          </FormLabel>
          <Box>
            {renderInputField(selectedInputField)}
          </Box>
        </FormControl>,
      );
    }
    return formList;
  };

  return {
    renderInputFields,
    additionalInputs,
  };
}