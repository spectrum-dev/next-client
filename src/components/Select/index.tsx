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
  valueContainer: () => ({
    color: 'white',
  }),
  input: (provided: any) => ({
    ...provided,
    color: 'white',
    paddingLeft: 10,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    paddingLeft: 10,
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
  }: {
    placeholder: string;
    options: Array<any>,
    onInputChange: any,
    onChange: any,
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
    />
  );
};

export default CustomSelect;
