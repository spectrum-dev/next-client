/* eslint-disable */ 
import { useEffect, useState, ReactNode } from 'react';
import _ from 'lodash';

import { useQuery } from '@apollo/client';
import { Box, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput as ChakraNumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react';

// Custom Components
import CustomDropdown from 'react-dropdown';
import CustomSelect from 'components/Select';
import CustomDatePicker from 'components/DateRangePicker';

import { QUERY_GET_BLOCK_METADATA } from '../../Modals/BlockSelection/gql';
import { BlockType, Inputs, SetInputs } from '../../index.types';

import fetcher from 'app/fetcher';
import { formatDate } from 'app/utils';


/**
 * Free Number Input
 */
const NumberInput = ({ inputElement, fieldVariableName, setInputs }: { inputElement: any, fieldVariableName: string, setInputs: SetInputs }) => {
  const onChange = (tempValue: string) => {
    setInputs((inputs: Inputs) => {
      const newData = {
        [fieldVariableName]: { value: tempValue },
      };
              
      return _.merge(
        inputs,
        newData,
      );
    });        
  };
  
  return (
    <ChakraNumberInput
        min={0}
        value={inputElement?.value}
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
  const onChange = (selectedItem: any) => {
    if (inputElement.hasOwnProperty('onChange')) {
      const { onChange } = fieldData;

      const onChangeResponse = fetcher(`/orchestration/${blockType}/${blockId}/${onChange}${selectedItem.value}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      onChangeResponse.then((res) => {
        setInputs((inp: any) => {
          // eslint-disable-next-line @typescript-eslint/no-shadow
          let additionalInputs = {};

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
        });
      })
    }

    setInputs((inputs: Inputs) => {
      const newData = {
        [id]: {
          [fieldVariableName]: {
            value: selectedItem.value,
          },
        },
      };

      return _.merge(
        newData,
        inputs,
      );
    });
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
  };

  return (
    <CustomSelect
      placeholder="Type here to start search"
      options={inputElement?.options}
      value={inputElement?.value}
      onInputChange={onInputChange}
      onChange={onChange}
    />
  );
};

/**
 * Date Range Pickers
 */
const DateRangePicker = ({ startDate, endDate, fieldVariableNames, setInputs }: { startDate: any, endDate: any, fieldVariableNames: Array<string>, setInputs: SetInputs }) => {
  const onStartChange = (value: any) => {
    setInputs((inputs: Inputs) => {
      const newData = {
        [fieldVariableNames[0]]: {
          rawValue: value,
          value: formatDate(value),
        },
      };

      return _.merge(
        newData,
        inputs,
      );
    });
  };

  const onEndChange = (value: any) => {
    setInputs((inputs: Inputs) => {
      const newData = {
        [fieldVariableNames[1]]: {
          rawValue: value,
          value: formatDate(value),
        },
      };
      
      return _.merge(
        newData,
        inputs,
      );
    });
  };

  return (
    <CustomDatePicker
      startDate={startDate}
      endDate={endDate}
      onStartChange={onStartChange}
      onEndChange={onEndChange}
    />
  );
};
  
/**
 * Provide the block ID that has been selected to be edited
 * (maximum one at a time) and 
 */
const useInputFields = (
  { id, blockType, blockId, inputs, setInputs }:
  { id: string, blockType: BlockType, blockId: number, inputs: Inputs, setInputs: SetInputs },
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
            startDate={startDate}
            endDate={endDate}
            fieldVariableNames={fieldVariableNames}
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
  }, [id, blockType, blockId, data, error, inputs])

  useEffect(() => {
    const merged = _.merge(_.keyBy(rawFieldMetadata, 'fieldName'), _.keyBy(additionalFields, 'fieldName'));
    const values = _.values(merged);
    
    renderFields(values);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawFieldMetadata, additionalFields, setRawFieldMetadata, setAdditionalFields]);  

  return { fields };
};

export default useInputFields;