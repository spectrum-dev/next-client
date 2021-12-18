import { useEffect, useState, ReactNode } from 'react';
import _ from 'lodash';

import { useQuery } from '@apollo/client';
import { Box, FormControl, FormLabel, NumberDecrementStepper, NumberIncrementStepper, NumberInput as ChakraNumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react';

// Custom Components
import CustomDropdown from 'react-dropdown';

import { QUERY_GET_BLOCK_METADATA } from '../../Modals/BlockSelection/gql';
import { BlockType, Inputs, SetInputs } from '../../index.types';

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
        value={inputElement.value}
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
const Dropdown = ({ inputElement, fieldVariableName, setInputs }: { inputElement: any, fieldVariableName: string, setInputs: SetInputs }) => {
  const onChange = (selectedItem: any) => {
    if (inputElement.hasOwnProperty('onChange')) {
      // TODO: Implement util to handle onChange events
      console.log('Handle onChange Event');
    }

    setInputs((inputs: Inputs) => {
      const newData = {
        [fieldVariableName]: {
          value: selectedItem.value,
        },
      };

      return _.merge(
        inputs,
        newData,
      );
    });
  };

  return (
    <CustomDropdown
      options={inputElement.options}
      value={inputElement.value}
      onChange={onChange}
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
  const [fields, setFields] = useState<Array<ReactNode>>([]);
  // const { inputs, setInputs } =  useContext(CanvasContext);
  const { data, error } = useQuery(QUERY_GET_BLOCK_METADATA, { variables: { blockType, blockId } });

  const renderField = (field: any) => {
    if (!field && !field?.fieldType) {
      return <></>;
    }
        
    const { fieldType, fieldVariableName } = field;
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
            inputElement={value}
            fieldVariableName={fieldVariableName}
            setInputs={setInputs}
          />
        );
      default:
        return (
          <NumberInput
              inputElement={value}
              fieldVariableName={fieldVariableName}
              setInputs={setInputs}
          />
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

    renderFields(blockInputs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, blockType, blockId, data, error, inputs]);  

  return { fields };
};

export default useInputFields;