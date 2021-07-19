import Select from 'react-select';

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
    if (options) {
      // eslint-disable-next-line no-restricted-syntax
      for (const option of options) {
        processedOptions.push(
          {
            value: option,
            label: option,
          },
        );
      }
    }

    return processedOptions;
  };
  return (
    <Select
      placeholder={placeholder}
      options={transformOptions()}
      onInputChange={onInputChange}
      onChange={onChange}
    />
  );
};

export default CustomSelect;
