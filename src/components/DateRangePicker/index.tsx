// @ts-nocheck
import { useState, useEffect, forwardRef } from 'react';

import { Button, Box, FormLabel } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import styles from './index.module.css';

// eslint-disable-next-line react/prop-types
const CustomInput = forwardRef(({ value, onClick }, ref) => {
  const [dateValue, setDateValue] = useState(value ? new Date(value) : new Date());

  useEffect(() => {
    setDateValue(value ? new Date(value) : '');
  }, [value]);
  
  return (
    // eslint-disable-next-line react/button-has-type
    <Button onClick={onClick} ref={ref} width="100%">
      {dateValue.toDateString()}
    </Button>
  );
});

const DateRangePicker = (
  {
    startDate,
    endDate,
    onStartChange,
    onEndChange,

  }: {
    startDate: string;
    endDate: string;
    onStartChange: any;
    onEndChange: any;
  },
) => {
  const componentStartDate = startDate ? new Date(startDate) : new Date();
  const componentEndDate = endDate ? new Date(endDate) : new Date();

  return (
    <>
      <Box>
        <FormLabel fontSize="sm">
          Start Date
        </FormLabel>
        <DatePicker
          selected={componentStartDate}
          onChange={onStartChange}
          selectsStart
          startDate={componentStartDate}
          endDate={componentEndDate}
          customInput={<CustomInput />}
          popperPlacement="bottom"
          popperClassName={styles.popperCustomerClass}
        />
      </Box>
      <Box marginTop="1rem">
        <FormLabel fontSize="sm">
          End Date
        </FormLabel>
        <DatePicker
          selected={componentEndDate}
          onChange={onEndChange}
          selectsEnd
          startDate={componentStartDate}
          endDate={componentEndDate}
          minDate={componentStartDate}
          customInput={<CustomInput />}
          popperPlacement="bottom"
          popperClassName={styles.popperCustomerClass}
        />
      </Box>
    </>
  );
};

export default DateRangePicker;
