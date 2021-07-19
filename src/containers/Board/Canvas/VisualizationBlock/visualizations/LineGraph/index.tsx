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
) => (
  <ChartCanvas
    height={height}
    width={width}
    ratio={ratio}
    xScale={xScale}
    xAccessor={xAccessor}
    xExtents={xExtents}
    displayXAccessor={displayXAccessor}
    data={data}
    seriesName=""
  >
    <Chart id={1} yExtents={yExtents}>
      <LineSeries yAccessor={yAccessor} />
      <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} />
      <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} />
    </Chart>
  </ChartCanvas>
);

export default LineGraph;
