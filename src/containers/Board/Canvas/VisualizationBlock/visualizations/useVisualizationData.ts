import { useState } from 'react';

import { discontinuousTimeScaleProviderBuilder } from '@react-financial-charts/scales';

import { VisualizationType } from './useGraphTypeValidation';

interface State {
  isLoading: boolean;
  hasError: boolean;
}

export default function useVisualizationData({
  rawData, graphType, xValue, yValue,
}:
{ rawData: any, graphType: VisualizationType, xValue: string, yValue: string }) {
  const [state] = useState<State>({
    isLoading: false,
    hasError: false,
  });

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
    data, xScale, xAccessor, displayXAccessor,
  } = xScaleProvider(cleanedData);

  const xExtents = [
    xAccessor(data[data.length - 1]), xAccessor(data[0]),
  ];

  // Y Axis Calculations
  const yAccessor = (yAccessorData: any) => yAccessorData?.[yValue];

  const calculateYExtents = () => {
    let min = 1000000;
    let max = -1;
    // eslint-disable-next-line no-restricted-syntax
    for (const element of data) {
      switch (graphType) {
        case VisualizationType.Line:
          if (yAccessor(element) !== null) {
            min = Math.min(min, yAccessor(element));
          }
          max = Math.max(max, yAccessor(element));
          break;
        case VisualizationType.Candlestick:
          min = Math.min(min, element.low);
          max = Math.max(max, element.high);
          break;
        default:
          break;
      }
    }

    return [min, max];
  };

  const yExtents = calculateYExtents();

  return {
    ...state,
    data,
    xScale,
    xAccessor,
    xExtents,
    displayXAccessor,
    yAccessor,
    yExtents,
    hasError: false,
  };
}
