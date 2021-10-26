import Select from 'react-select';

const customStyles = {
  option: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: state.isSelected ? 'white' : '#848485',
    color: state.isSelected ? 'black' : 'white',
  }),
  control: (provided: any) => ({
    ...provided,
    backgroundColor: '#2D3748',
    borderColor: '#2D3748',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
  singleValue: (provided: any) => ({
    ...provided, color: 'white', borderColor: 'green', paddingLeft: 10,
  }),
  menu: (provided: any) => ({
    ...provided,
    color: 'white',
  }),
};

const CustomSelect = (
  {
    placeholder,
    options,
    onInputChange,
    onChange,
    value,
  }: {
    placeholder: string;
    options: Array<any>,
    onInputChange: any,
    onChange: any,
    value: any,
  },
) => {
  const transformOptions = () => {
    const processedOptions = [];
    if (options && typeof options[0] === 'string') {
      // eslint-disable-next-line no-restricted-syntax
      for (const option of options) {
        processedOptions.push(
          {
            value: option,
            label: option,
          },
        );
      }

      return processedOptions;
    }
    return options;
  };
  return (
    <Select
      styles={customStyles}
      placeholder={placeholder}
      options={transformOptions()}
      onInputChange={onInputChange}
      onChange={onChange}
      value={
        transformOptions().filter((option) => option.value === value)
      }
    />
  );
};

export default CustomSelect;
