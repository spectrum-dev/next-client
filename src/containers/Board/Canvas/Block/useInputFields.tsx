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

// Custom Components
import CustomSelect from 'components/Select';

// Utils
import fetcher from 'app/fetcher';

// Contexts
import InputContext from 'app/contexts/input';

export default function useInputFields({ id }: { id: any }) {
  // @ts-ignore
  const { inputs, setInputs } = useContext(InputContext);

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
      const onSearchResponse = await fetcher(`/orchestration/${blockType}/${blockId}${url}${parameter}`);
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
          <CustomSelect
            title={inputField?.fieldName}
            placeholder="Type here to start search"
            options={inputs?.[id]?.[inputField?.fieldVariableName].options}
            // value={inputs?.[id]?.[input?.fieldVariableName].value}
            onInputChange={(inputtedQuery: any) => {
              handleOnSearchEvent(
                id,
                inputs?.[id].blockType,
                inputs?.[id].blockId,
                inputField?.fieldData?.base,
                inputField?.fieldVariableName,
                inputtedQuery,
              );
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
