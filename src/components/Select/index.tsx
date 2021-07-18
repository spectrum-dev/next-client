import { StyledSelect } from './index.styles';

const Select = (
  {
    placeholder,
    options,
    onInputChange,
    onChange,
  }: {
    title: string;
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
    <StyledSelect
      placeholder={placeholder}
      options={transformOptions()}
      className="react-select-container"
      classNamePrefix="react-select"
      onInputChange={onInputChange}
      onChange={onChange}
    />
  );
};

export default Select;
