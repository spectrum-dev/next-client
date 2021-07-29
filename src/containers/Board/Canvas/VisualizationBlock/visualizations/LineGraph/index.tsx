import { format } from 'd3-format';

import { MouseCoordinateY, ZoomButtons } from 'react-financial-charts';
import { XAxis, YAxis } from '@react-financial-charts/axes';
import { Chart, ChartCanvas } from '@react-financial-charts/core';
import { LineSeries } from '@react-financial-charts/series';

const LineGraph = (
  {
    height, width, ratio, xScale, xAccessor, xExtents, displayXAccessor, yExtents, yAccessor, data,
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
    yAccessor: any,
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
        <LineSeries yAccessor={yAccessor} />
        <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={20} />
        <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={20} tickFormat={pricesDisplayFormat} />
        <MouseCoordinateY rectWidth={80} displayFormat={pricesDisplayFormat} fontSize={20} />
        <ZoomButtons />
      </Chart>
    </ChartCanvas>
  );
};

export default LineGraph;
