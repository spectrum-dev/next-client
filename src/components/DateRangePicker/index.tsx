// @ts-nocheck
import { forwardRef } from 'react';

import { Box, FormLabel } from '@chakra-ui/react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import styles from './index.module.css';

// eslint-disable-next-line react/prop-types
const CustomInput = forwardRef(({ value, onClick }, ref) => (
  // eslint-disable-next-line react/button-has-type
  <button className={styles.dateInputButton} onClick={onClick} ref={ref}>
    {value}
  </button>
));

const DateRangePicker = (
  {
    startDate,
    endDate,
    onStartChange,
    onEndChange,

  }: {
    startDate: string;
    endDate: string;
    onStartChange: () => void;
    onEndChange: () => void;
  },
) => (
  <>
    <Box>
      <FormLabel textColor="white">
        Start Date
      </FormLabel>
      <DatePicker
        selected={new Date(startDate)}
        onChange={onStartChange}
        selectsStart
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        customInput={<CustomInput />}
        popperPlacement="bottom"
        popperClassName={styles.popperCustomerClass}
      />
    </Box>
    <Box>
      <FormLabel textColor="white">
        End Date
      </FormLabel>
      <DatePicker
        selected={new Date(endDate)}
        onChange={onEndChange}
        selectsEnd
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        minDate={new Date(startDate)}
        customInput={<CustomInput />}
        popperPlacement="bottom"
        popperClassName={styles.popperCustomerClass}
      />
    </Box>
  </>
);

export default DateRangePicker;
