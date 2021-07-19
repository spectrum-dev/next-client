import { CrossHairCursor } from 'react-financial-charts';
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
      <CandlestickSeries />
      <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} />
      <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} />
    </Chart>
    <CrossHairCursor />
  </ChartCanvas>
);

export default CandlestickGraph;
