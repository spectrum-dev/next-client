import { format } from 'd3-format';

import { CrossHairCursor, MouseCoordinateY, ZoomButtons } from 'react-financial-charts';
import { XAxis, YAxis } from '@react-financial-charts/axes';
import { Chart, ChartCanvas } from '@react-financial-charts/core';
import { CandlestickSeries } from '@react-financial-charts/series';

const CandlestickGraph = (
  {
    height, width, ratio, xScale, xAccessor, xExtents, displayXAccessor, yExtents, data,
  }:
  {
    height: number,
    width: number,
    ratio: number,
    xScale: any,
    xAccessor: any,
    xExtents: any,
    displayXAccessor: any,
    yExtents: any,
    data: any
  },
) => {
  const pricesDisplayFormat = format('.2f');

  return (
    <ChartCanvas
      clamp
      height={height}
      width={width}
      ratio={ratio}
      xScale={xScale}
      xAccessor={xAccessor}
      xExtents={xExtents}
      displayXAccessor={displayXAccessor}
      data={data}
      seriesName=""
      margin={{
        left: 0, right: 150, top: 0, bottom: 48,
      }}
    >
      <Chart id={1} yExtents={yExtents}>
        <CandlestickSeries />
        <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={10} zoomEnabled={false} fontSize={20} />
        <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={10} zoomEnabled={false} fontSize={20} tickFormat={pricesDisplayFormat} />
        <MouseCoordinateY rectWidth={80} displayFormat={pricesDisplayFormat} fontSize={20} />
        <ZoomButtons />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default CandlestickGraph;
