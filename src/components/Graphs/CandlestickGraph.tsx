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
import { CandlestickSeries, BarSeries } from '@react-financial-charts/series';

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
  readonly volumeChartHeight?: number;
}

const CandlestickGraph = (
  {
    data,
    height,
    width,
    ratio,
    fontSize,
    margin,
    disableInteraction,
    xValue,
    volumeChartHeight = 120,
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

    // TODO: Added extra 5% toleterance for lower and 3% for upper
    return [min - (min * 0.05), max + (max * 0.03)];
  };

  const xExtents = [
    xAccessor(graphData[0]), xAccessor(graphData[graphData.length - 1]),
  ];

  const timeDisplayFormat = timeFormat('%b %d');

  // Volume Bar Chart
  const barChartOrigin = (_: number, h: number) => [0, h - volumeChartHeight];
  const barChartExtents = (volumeChartData: RecordData) => volumeChartData.volume;
  const volumeSeries = (volumeChartData: RecordData) => volumeChartData.volume;
  const volumeColor = (volumeChartData: RecordData) => (
    volumeChartData.close > volumeChartData.open ? 'rgba(38, 166, 154, 0.3)' : 'rgba(239, 83, 80, 0.3)'
  );

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
      <Chart id={2} height={volumeChartHeight} origin={barChartOrigin} yExtents={barChartExtents}>
        <BarSeries fillStyle={volumeColor} yAccessor={volumeSeries} />
      </Chart>
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
