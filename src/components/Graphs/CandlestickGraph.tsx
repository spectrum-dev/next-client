import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

import {
  discontinuousTimeScaleProviderBuilder,
  withSize,
  withDeviceRatio,
  MouseCoordinateX,
  MouseCoordinateY,
  ZoomButtons,
  CrossHairCursor,
} from 'react-financial-charts';
import { XAxis, YAxis } from '@react-financial-charts/axes';
import { Chart, ChartCanvas } from '@react-financial-charts/core';
import { CandlestickSeries } from '@react-financial-charts/series';

type RecordData = Record<string, number>;

interface CandlestickGraphProps {
  readonly data: Array<RecordData>;
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
  readonly fontSize?: number;
  readonly margin?: { bottom: number; left: number; right: number; top: number; } | undefined;
  readonly disableInteraction: boolean;
  readonly xValue?: string;
}

const CandlestickGraph = (
  {
    data, height, width, ratio, fontSize, margin, disableInteraction, xValue,
  }: CandlestickGraphProps,
) => {
  const pricesDisplayFormat = format('.4f');
  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d: RecordData) => (
      xValue ? new Date(d[xValue]) : new Date(d.timestamp)
    ),
  );
  const {
    data: graphData, xScale, xAccessor, displayXAccessor,
  } = xScaleProvider(data);

  const yExtents = () => {
    let min = 1000000;
    let max = -1;
    for (const element of data) {
      min = Math.min(min, element.low);
      max = Math.max(max, element.high);
    }

    return [min, max];
  };

  const xExtents = [
    xAccessor(graphData[0]), xAccessor(graphData[graphData.length - 1]),
  ];

  const timeDisplayFormat = timeFormat('%b %d');

  return (
    <ChartCanvas
      clamp={!disableInteraction}
      disableInteraction={disableInteraction}
      height={height}
      width={width}
      ratio={ratio}
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      displayXAccessor={displayXAccessor}
      data={graphData}
      seriesName=""
      margin={margin || {
        left: 0, right: 50, top: 10, bottom: 40,
      }}
    >
      <Chart id={1} yExtents={yExtents}>
        <CandlestickSeries />
        <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={fontSize || 10} />
        <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={fontSize || 10} tickFormat={pricesDisplayFormat} />
        {!disableInteraction && (
          <>
            <MouseCoordinateX displayFormat={timeDisplayFormat} />
            <MouseCoordinateY
              displayFormat={pricesDisplayFormat}
              fontSize={fontSize || 10}
            />
            <ZoomButtons />
          </>
        )}
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

// @ts-ignore
export default withSize()(withDeviceRatio()(CandlestickGraph));
