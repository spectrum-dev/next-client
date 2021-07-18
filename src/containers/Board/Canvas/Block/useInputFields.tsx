import { useContext } from 'react';
import {
  Select,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';

// Contexts
import InputContext from 'app/contexts/input';

export default function useInputFields({ id }: { id: any }) {
  // @ts-ignore
  const { inputs, setInputs } = useContext(InputContext);

  const renderInputField = (inputField: any) => {
    if ((!inputField && !inputField.fieldType) || (inputs && Object.keys(inputs).length === 0)) {
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
        for (const elem of inputs?.[id]?.[inputField?.fieldVariableName].options) {
          options.push(
            <option value={elem}>
              { elem }
            </option>,
          );
        }
        return (
          <Select
            value={inputs?.[id]?.[inputField?.fieldVariableName].value}
            onChange={(event) => {
              setInputs((inp: any) => ({
                ...inp,
                [id]: {
                  ...inp[id],
                  [inputField?.fieldVariableName]: {
                    ...inp[id][inputField?.fieldVariableName],
                    value: event.target.value,
                  },
                },
              }));
            }}
          >
            { options }
          </Select>
        );
      case 'search':
        return (
          <div>
            Search
          </div>
        );
      case 'date_range':
        return (
          <div>
            Date Range
          </div>
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
        <FormControl>
          <FormLabel>
            { selectedInputField.fieldName }
          </FormLabel>
          {renderInputField(selectedInputField)}
        </FormControl>,
      );
    }
    return formList;
  };

  return {
    renderInputFields,
  };
}
