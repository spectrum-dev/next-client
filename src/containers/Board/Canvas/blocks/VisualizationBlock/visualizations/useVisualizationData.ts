import { useState } from 'react';

import { discontinuousTimeScaleProviderBuilder } from '@react-financial-charts/scales';

interface State {
  isLoading: boolean;
  hasError: boolean;
}

export default function useVisualizationData({
  rawData, xValue,
}:
{ rawData: any, xValue: string, }) {
  const [state] = useState<State>({
    isLoading: false,
    hasError: false,
  });

  if (!rawData) {
    return {
      isLoading: false,
      hasError: true,
      data: undefined,
      xScale: undefined,
      xAccessor: undefined,
      xExtents: undefined,
      displayXAccessor: undefined,
      yAccessor: undefined,
      yExtents: undefined,
    };
  }
  // Case where json is getting passed in and there
  // are multiple returned outputs is getting passed in
  if (!Array.isArray(rawData)) {
    return {
      isLoading: false,
      hasError: true,
      data: undefined,
      xScale: undefined,
      xAccessor: undefined,
      xExtents: undefined,
      displayXAccessor: undefined,
      yAccessor: undefined,
      yExtents: undefined,
    };
  }

  // Function that converts the x-axis data into proper value
  const cleanedData = rawData.map((item: Record<any, any>) => ({
    ...item,
    date: new Date(item?.[xValue]),
  }));

  // X Axis Calculations
  const xScaleProvider = (
    discontinuousTimeScaleProviderBuilder().inputDateAccessor((d: any) => d.date)
  );

  const {
    data,
  } = xScaleProvider(cleanedData);

  return {
    ...state,
    data,
    hasError: false,
  };
}
