import { useState, useEffect, useCallback } from 'react';
import { checkKeys } from 'app/utils';

interface State {
  isLoading: boolean;
  hasError: boolean;
  candlestickSupported: boolean;
  xValue: string;
  yValues: Array<any>
}

const VALID_X_KEYS = ['timestamp', 'date'];
const VALID_CANDLESTICK_KEYS = ['open', 'high', 'low', 'close', 'volume'];

export default function useGraphTypeValidation({ data }:
{ data: any }) {
  const [state, setState] = useState<State>({
    isLoading: false,
    hasError: false,
    candlestickSupported: false,
    xValue: '',
    yValues: [],
  });

  const validateIncomingData = useCallback(async () => {
    if (!Array.isArray(data) || data.length === 0) {
      setState({
        hasError: true,
        isLoading: false,
        candlestickSupported: false,
        xValue: '',
        yValues: [],
      });
    } else {
      const incomingKeys = Object.keys(data[0]);
      const xKeys = checkKeys(data, VALID_X_KEYS);

      const isCandlestickSupported = VALID_CANDLESTICK_KEYS.map((key) => (
        incomingKeys.includes(key)
      )).every(Boolean);

      if (xKeys.isValid && isCandlestickSupported) {
        setState((elem) => ({
          ...elem,
          xValue: xKeys.values[0],
          yValues: VALID_CANDLESTICK_KEYS,
          candlestickSupported: true,
          hasError: false,
        }));
      }

      if (xKeys.isValid) {
        const yValues = incomingKeys.filter((el: any) => !VALID_X_KEYS.includes(el));

        setState((elem) => ({
          ...elem,
          xValue: xKeys.values[0],
          yValues,
          hasError: false,
        }));
      } else {
        setState((elem) => ({
          ...elem,
          hasError: true,
        }));
      }
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      validateIncomingData();
    }
  }, [data, validateIncomingData]);

  return state;
}
