/* eslint-disable */ 
import { useEffect, useState, ReactNode } from 'react';
import _ from 'lodash';

import { useQuery } from '@apollo/client';
import { Box, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput as ChakraNumberInput, NumberInputField, NumberInputStepper, Text } from '@chakra-ui/react';

// Custom Components
import CustomDropdown from 'react-dropdown';
import CustomSelect from 'components/Select';
import CustomDatePicker from 'components/DateRangePicker';

import { QUERY_GET_BLOCK_METADATA } from '../../Modals/BlockSelection/gql';
import { BlockType, InputDependencyGraph, Inputs, SetInputs } from '../../index.types';

import fetcher from 'app/fetcher';
import { formatDate } from 'app/utils';


/**
 * Free Number Input
 */
const NumberInput = ({ id, inputElement, fieldVariableName, setInputs }: { id: string, inputElement: any, fieldVariableName: string, setInputs: SetInputs }) => {
  const [value, setValue] = useState(inputElement?.value || '')
  
  const onChange = (value: string) => {
    setInputs((inp: any) => ({
      ...inp,
      [id]: {
        ...inp?.[id],
        [fieldVariableName]: { value },
      },
    }));

    setValue(value);      
  };

  return (
    <ChakraNumberInput
        min={0}
        value={value}
        onChange={onChange}
    >
        <NumberInputField />
        <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
        </NumberInputStepper>
    </ChakraNumberInput>
  );
};

/**
 * Dropdown that handles custom renders
 */
const Dropdown = ({ id, inputElement, fieldVariableName, blockType, blockId, fieldData, setInputs, setAdditionalFields }: { id: string, inputElement: any, fieldVariableName: string, blockType: BlockType, blockId: number, fieldData: any, setInputs: SetInputs, setAdditionalFields: any }) => {
  
  const handleOnChangeEvent = (inputValue: string) => {
      const { onChange } = fieldData;

      const onChangeResponse = fetcher(`/orchestration/${blockType}/${blockId}/${onChange}${inputValue}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      onChangeResponse.then((res) => {
        setInputs((inp: any) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let additionalInputs = {};
          
          if (res.status !== 200) {
            return;
          }
          
          if (res.data.response) {
            for (const inputValue of res.data.response) {
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
  
            setAdditionalFields(res.data.response);
  
            return {
              ...inp,
              [id]: {
                ...inp?.[id],
                ...additionalInputs,
              },
            };
          }
        });
      })
  }
  
  const onChange = (selectedItem: any) => {
    if (inputElement.hasOwnProperty('onChange')) {
      handleOnChangeEvent(selectedItem.value)
    }

    setInputs((inp: Inputs) => ({
      ...inp,
      [id]: {
        ...inp[id],
        [fieldVariableName]: {
          ...inp[id][fieldVariableName],
          value: selectedItem.value,
        },
      },
    }));
  };

  return (
    <CustomDropdown
      options={inputElement?.options}
      value={inputElement?.value}
      onChange={onChange}
    />
  );
};

/**
 * Search field
 */
const Search = ({ id, inputElement, fieldVariableName, blockType, blockId, fieldData, setInputs }: { id: string, inputElement: any, fieldVariableName: string, blockType: BlockType, blockId: number, fieldData: any, setInputs: SetInputs }) => {
  const [value, setValue] = useState(inputElement?.value || '');
  const [options, setOptions] = useState([]);

  const onInputChange = (query: string) => {
    if (query === '') {
      return
    }
    
    const { base } = fieldData;

    const onSearchResponse = fetcher(`/orchestration/${blockType}/${blockId}${base}${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    onSearchResponse.then((resp) => {
      setInputs((inp: Inputs) => ({
        ...inp,
        [id]: {
          ...inp?.[id],
          [fieldVariableName]: {
            ...inp?.[id]?.[fieldVariableName],
            options: resp.status === 200 ? resp.data.response : [],
          },
        },
      }));
      setOptions(resp.status === 200 ? resp.data.response : []);
    }).catch((err) => {
      console.error(err);
    })
  }

  const onChange = (selectedItem: any) => {
    setInputs((inp: Inputs) => ({
      ...inp,
      [id]: {
        ...inp[id],
        [fieldVariableName]: {
          ...inp[id][fieldVariableName],
          value: selectedItem.value,
        },
      },
    }));
    setValue(selectedItem.value);
  };

  return (
    <CustomSelect
      placeholder="Search"
      options={options}
      value={value}
      onInputChange={onInputChange}
      onChange={onChange}
    />
  );
};

/**
 * Date Range Pickers
 */
const DateRangePicker = ({ id, startDate, endDate, fieldVariableNames, setInputs }: { id: string, startDate: any, endDate: any, fieldVariableNames: Array<string>, setInputs: SetInputs }) => {
  const [componentStartDate, setComponentStartDate] = useState(startDate || '');
  const [componentEndDate, setComponentEndDate] = useState(endDate || '');

  const onStartChange = (value: any) => {
    setInputs((inp: Inputs) => ({
      ...inp,
      [id]: {
        ...inp?.[id],
        [fieldVariableNames[0]]: {
          rawValue: value,
          value: formatDate(value),
        },
      },
    }));
    setComponentStartDate(value);
  };

  const onEndChange = (value: any) => {
    setInputs((inp: Inputs) => ({
      ...inp,
      [id]: {
        ...inp?.[id],
        [fieldVariableNames[1]]: {
          rawValue: value,
          value: formatDate(value),
        },
      },
    }));
    setComponentEndDate(value);
  };

  return (
    <CustomDatePicker
      startDate={componentStartDate}
      endDate={componentEndDate}
      onStartChange={onStartChange}
      onEndChange={onEndChange}
    />
  );
};

/**
 * Inputs From Connection
 */
const InputsFromConnection = ({ id, inputDependencyGraph, fieldVariableName, inputElement, setInputs }: { id: string, inputDependencyGraph: any, fieldVariableName: string, inputElement: any, setInputs: SetInputs }) => {
  if (!inputDependencyGraph || !inputDependencyGraph?.[id]) {
    return (
      <Text fontSize="md"> Please add a connection to the block </Text>
    )
  }

  const inputFromConnectionValue = inputElement?.inputFromConnectionValue;
  const dataKeyOptions = inputFromConnectionValue ? inputDependencyGraph?.[id]?.[inputFromConnectionValue]?.outputInterface : [];

  const numConnections = Object.keys(inputDependencyGraph?.[id]).length

  if (numConnections === 0) {
    return (
      <Box>
        Please connect the block
      </Box>
    )
  }
  if (numConnections === 1) {
    return (
      <Box>
        <CustomDropdown
          options={inputDependencyGraph?.[id]?.[
            Object.keys(inputDependencyGraph?.[id])[0]
          ]?.outputInterface}
          value={inputElement?.value}
          onChange={(selectedItem: any) => {
            setInputs((inp: any) => ({
              ...inp,
              [id]: {
                ...inp[id],
                [fieldVariableName]: {
                  ...inp[id][fieldVariableName],
                  value: selectedItem.value,
                },
              },
            }));
          }}
        />
      </Box>
    )
  }

  return (
    <>
      <FormLabel textColor="white" fontSize={15}>
        Block ID
      </FormLabel>
      <Box>
        <CustomDropdown
          options={Object.keys(inputDependencyGraph?.[id])}
          value={inputFromConnectionValue}
          onChange={(selectedItem: any) => {
            setInputs((inp: any) => ({
              ...inp,
              [id]: {
                ...inp[id],
                [fieldVariableName]: {
                  ...inp[id][fieldVariableName],
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
        <CustomDropdown
          options={dataKeyOptions}
          value={inputElement?.value}
          onChange={(selectedItem: any) => {
            setInputs((inp: any) => ({
              ...inp,
              [id]: {
                ...inp[id],
                [fieldVariableName]: {
                  ...inp[id][fieldVariableName],
                  value: selectedItem.value,
                },
              },
            }));
          }}
        />
      </Box>
    </>
  );
};

/**
 * Provide the block ID that has been selected to be edited
 * (maximum one at a time) and 
 */
const useInputFields = (
  { id, blockType, blockId, inputs, setInputs, inputDependencyGraph }:
  { id: string, blockType: BlockType, blockId: number, inputs: Inputs, setInputs: SetInputs, inputDependencyGraph: InputDependencyGraph },
) => {
  const [rawFieldMetadata, setRawFieldMetadata] = useState([]);
  const [additionalFields, setAdditionalFields] = useState([]);
  const [fields, setFields] = useState<Array<ReactNode>>([]);
  const { data, error } = useQuery(QUERY_GET_BLOCK_METADATA, { variables: { blockType, blockId } });

  const renderField = (field: any) => {
    if (!field && !field?.fieldType) {
      return <></>;
    }
        
    const { fieldType, fieldVariableName, fieldVariableNames, fieldData } = field;
    const value = inputs?.[id]?.[fieldVariableName];
    
    switch (fieldType) {
      case 'input':
        return (
          <NumberInput
            id={id}
            inputElement={value}
            fieldVariableName={fieldVariableName}
            setInputs={setInputs}
          />
        );
      case 'dropdown':
        return (
          <Dropdown
            id={id}
            inputElement={value}
            fieldVariableName={fieldVariableName}
            blockType={blockType}
            blockId={blockId}
            fieldData={fieldData}
            setInputs={setInputs}
            setAdditionalFields={setAdditionalFields}
          />
        );
      case 'search':
        return (
          <Search
            id={id}
            inputElement={value}
            fieldVariableName={fieldVariableName}
            blockType={blockType}
            blockId={blockId}
            fieldData={fieldData}
            setInputs={setInputs}
          />
        );
      case 'date_range':
        const startDate = inputs?.[id]?.[fieldVariableNames[0]]?.rawValue;
        const endDate = inputs?.[id]?.[fieldVariableNames[1]]?.rawValue;

        return (
          <DateRangePicker
            id={id}
            startDate={startDate}
            endDate={endDate}
            fieldVariableNames={fieldVariableNames}
            setInputs={setInputs}
          />
        );
      case 'inputs_from_connection':
        return (
          <InputsFromConnection
            id={id}
            inputDependencyGraph={inputDependencyGraph}
            fieldVariableName={fieldVariableName}
            inputElement={value}
            setInputs={setInputs}
          />
        );
      default:
        return (
          <div> Not Implemented </div>
        );
    }
  };

  // Main Runner - Takes in a list of inputs to populate the block metadata
  const renderFields = (blockInputs: any) => {
    const tempFields = [];
    for (const field of blockInputs) {
      const { fieldName } = field;
      tempFields.push(
                <FormControl key={`${id}_${fieldName}_${fieldName}`}>
                    <FormLabel>
                        { fieldName }
                    </FormLabel>
                    <Box>
                        {renderField(field)}
                    </Box>
                </FormControl>,
      );
    }

    setFields(tempFields);
  };

  useEffect(() => {
    setAdditionalFields([]);
  }, [id, blockType, blockId])

  useEffect(() => {
    // Error fetching block metadata
    if (error) {
      return;
    }

    if (!data) {
      return; 
    }

    const { blockMetadata } = data;
    if (!blockMetadata) {
      return;
    }

    const { inputs: blockInputs } = blockMetadata;

    if (inputs && Object.keys(inputs).length === 0) {
      return;
    }

    // The inputs object does not have the specified ID
    if (!inputs?.[id]) {
      // TODO: Determine what this return type should be
      return;
    }
    setRawFieldMetadata(blockInputs);
  }, [id, blockType, blockId, data, error, inputs, inputDependencyGraph, renderField])

  useEffect(() => {
    const merged = _.merge(_.keyBy(rawFieldMetadata, 'fieldName'), _.keyBy(additionalFields, 'fieldName'));
    const values = _.values(merged);
    
    renderFields(values);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawFieldMetadata, additionalFields, setRawFieldMetadata, setAdditionalFields]);  

  return { fields };
};

export default useInputFields;