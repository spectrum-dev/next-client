import { format } from 'd3-format';

import { discontinuousTimeScaleProviderBuilder, withSize, withDeviceRatio } from 'react-financial-charts';
import { XAxis, YAxis } from '@react-financial-charts/axes';
import { Chart, ChartCanvas } from '@react-financial-charts/core';
import { LineSeries } from '@react-financial-charts/series';

interface RecordData {
  readonly timestamp: string;
  readonly value: number;
}

interface LineGraphProps {
  readonly data: Array<RecordData>;
  readonly height: number;
  readonly width: number;
  readonly ratio: number;
  readonly fontSize?: number;
  readonly margin?: { bottom: number; left: number; right: number; top: number; } | undefined;
}

const LineGraph = (
  {
    data, height, width, ratio, fontSize, margin,
  }: LineGraphProps,
) => {
  const pricesDisplayFormat = format('.4f');
  const xScaleProvider = discontinuousTimeScaleProviderBuilder().inputDateAccessor(
    (d: RecordData) => new Date(d.timestamp),
  );
  const {
    data: graphData, xScale, xAccessor, displayXAccessor,
  } = xScaleProvider(data);

  const yAccessor = (inputData: RecordData) => inputData.value;

  const yExtents = () => {
    let min = 1000000;
    let max = -1;
    for (const element of data) {
      if (yAccessor(element) !== null) {
        min = Math.min(min, yAccessor(element));
      }
      max = Math.max(max, yAccessor(element));
    }

    return [min, max];
  };

  const xExtents = [
    xAccessor(graphData[0]), xAccessor(graphData[graphData.length - 1]),
  ];

  return (
    <ChartCanvas
      disableInteraction
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
        <LineSeries yAccessor={yAccessor} />
        <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={fontSize || 10} />
        <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={fontSize || 10} tickFormat={pricesDisplayFormat} />
      </Chart>
    </ChartCanvas>
  );
};

// @ts-ignore
export default withSize()(withDeviceRatio()(LineGraph));
