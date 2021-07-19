// @ts-nocheck
import { forwardRef } from 'react';

import { Box, Text } from '@chakra-ui/react';
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
    startDate: any;
    endDate: any;
    onStartChange: any;
    onEndChange: any;
  },
) => (
  <>
    <Box>
      <Text textColor="white" fontSize="23px">
        Start Date
      </Text>
      <DatePicker
        selected={new Date(startDate)}
        onChange={onStartChange}
        selectsStart
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        customInput={<CustomInput />}
        popperPlacement="right"
        popperClassName={styles.popperCustomerClass}
      />
    </Box>
    <Box>
      <Text textColor="white" fontSize="23px">
        End Date
      </Text>
      <DatePicker
        selected={new Date(endDate)}
        onChange={onEndChange}
        selectsEnd
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        minDate={new Date(startDate)}
        customInput={<CustomInput />}
        popperPlacement="right"
        popperClassName={styles.popperCustomerClass}
      />
    </Box>
  </>
);

export default DateRangePicker;
