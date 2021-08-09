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
}

const LineGraph = (
  {
    data, height, width, ratio,
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

  return (
    <ChartCanvas
      disableInteraction
      height={height}
      width={width}
      ratio={ratio}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      data={graphData}
      seriesName=""
      margin={{
        left: 0, right: 60, top: 10, bottom: 40,
      }}
    >
      <Chart id={1} yExtents={yExtents}>
        <LineSeries yAccessor={yAccessor} />
        <XAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={10} />
        <YAxis strokeStyle="white" tickLabelFill="white" tickStrokeStyle="white" tickStrokeWidth={2} zoomEnabled={false} fontSize={10} tickFormat={pricesDisplayFormat} />
      </Chart>
    </ChartCanvas>
  );
};

export default withSize({
  style: {
    minHeight: 355, minWidth: 800,
  },
// @ts-ignore
})(withDeviceRatio()(LineGraph));
