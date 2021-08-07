/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  memo, useState, useContext, useEffect, ReactNode,
} from 'react';

import {
  Box,
  Heading,
  Flex,
  Text,
  Spacer,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import styled from '@emotion/styled';

import { BsGear } from 'react-icons/bs';

import { Handle as RawHandle, Position, NodeProps } from 'react-flow-renderer';

// Utils
import { formatBlockTypeHeader } from 'app/utils';

// Contexts
import InputContext from 'app/contexts/input';

// Hooks
import useVisualizationData from './visualizations/useVisualizationData';
import useGraphTypeValidation, { VisualizationType } from './visualizations/useGraphTypeValidation';

// Drawer
import SettingsDrawer from './SettingsDrawer';

// Visualizations
import LineGraph from './visualizations/LineGraph';
import CandlestickGraph from './visualizations/CandlestickGraph';
import DataTable from './visualizations/DataTable';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Handle = styled(RawHandle)`
  /* Overrides for .react-flow__handle */
  width: 25px;
  height: 25px;
  border: 2px solid white;
  background: '#ed8936';
  
  /* Overrides for .react-flow__handle-left */
  .react-flow__handle .react-flow__handle-left {
    left: -12px;
  }
  .react-flow__handle .react-flow__handle-right {
    right: -12px;
  }
`;

export default memo(({ id, data: rawData }: NodeProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [[graphHeight, graphWidth, graphRatio]] = useState<[number, number, number]>(
    [750, 1340, 1.0],
  );
  const [transformedData, setTransformedData] = useState(rawData);

  useEffect(() => {
    setTransformedData(rawData);
  }, [rawData]);

  // @ts-ignore
  const { inputs, setInputs } = useContext(InputContext);

  const [graphType, setGraphType] = useState<VisualizationType>(
    inputs?.[id]?.graphType ? inputs?.[id]?.graphType : VisualizationType.Line,
  );

  const setDataKey = (dataKey: string) => {
    setInputs((inp: any) => ({
      ...inp,
      [id]: {
        ...inp[id],
        dataKey,
      },
    }));
  };

  const setDataKeys = (dataKeys: any) => {
    setInputs((inp: any) => ({
      ...inp,
      [id]: {
        ...inp[id],
        dataKeys,
      },
    }));
  };

  const setYValue = (yValue: string) => {
    setInputs((inp: any) => ({
      ...inp,
      [id]: {
        ...inp[id],
        yValue,
      },
    }));
  };

  useEffect(() => {
    if (!Array.isArray(rawData)) {
      const tempDataKeys = Object.keys(rawData);
      setDataKeys(inputs?.[id]?.dataKeys ? inputs?.[id]?.dataKeys : tempDataKeys);

      const loadedDataKey = inputs?.[id]?.dataKey ? inputs?.[id]?.dataKey : tempDataKeys[0];
      setDataKey(loadedDataKey);
      setTransformedData(rawData[loadedDataKey]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData]);

  useEffect(() => {
    setInputs((inp: any) => ({
      ...inp,
      [id]: {
        ...inp[id],
        graphType,
      },
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphType, setGraphType]);

  const {
    xValue, yValues, candlestickSupported, hasError: hasGraphTypeValidationError,
  } = useGraphTypeValidation({ data: transformedData });
  const {
    hasError: hasVisualizationDataError,
    data,
    xScale,
    xAccessor,
    xExtents,
    displayXAccessor,
    yAccessor,
    yExtents,
  } = useVisualizationData({
    rawData: transformedData,
    graphType,
    xValue,
    yValue: inputs?.[id]?.yValue,
  });

  // TODO: Determine whether there is a better way to set the yValue
  useEffect(() => {
    setYValue(yValues[0]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yValues]);

  const renderGraph = (): ReactNode => {
    switch (graphType) {
      case VisualizationType.Line:
        return (
          <LineGraph
            height={graphHeight}
            width={graphWidth}
            ratio={graphRatio}
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            displayXAccessor={displayXAccessor}
            yExtents={yExtents}
            yAccessor={yAccessor}
            data={data}
          />
        );
      case VisualizationType.Candlestick:
        return (
          <CandlestickGraph
            height={graphHeight}
            width={graphWidth}
            ratio={graphRatio}
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            displayXAccessor={displayXAccessor}
            yExtents={yExtents}
            data={data}
          />
        );
      case VisualizationType.DataTable:
        return (
          <DataTable data={rawData} />
        );
      default:
        return (
          <LineGraph
            height={graphHeight}
            width={graphWidth}
            ratio={graphRatio}
            xScale={xScale}
            xAccessor={xAccessor}
            xExtents={xExtents}
            displayXAccessor={displayXAccessor}
            yExtents={yExtents}
            yAccessor={yAccessor}
            data={data}
          />
        );
    }
  };

  return (
    <>
      <Box width="1300px" height="800px" borderRadius="25px" border="1px solid #1a202c" background="#1a202c" textAlign="center" insetBlockEnd="TEST">
        <Flex margin="10px 0px 0px 0px">
          <Spacer />
          <Heading textColor="white" size="xl" textAlign="center">
            { formatBlockTypeHeader(id) }
          </Heading>
          <Spacer />
          <IconButton aria-label="Edit" icon={<BsGear />} rounded="full" size="lg" fontSize="40px" textColor="white" background="#1a202c" onClick={onOpen} />
        </Flex>
        <Handle
          type="target"
          position={Position.Left}
          id={`input_${id}`}
          onConnect={() => null}
          isValidConnection={() => true}
        />
        <Box>
          {
            hasGraphTypeValidationError || hasVisualizationDataError
              ? (
                <Text>
                  There was an error rendering the graph
                </Text>
              ) : renderGraph()
          }
        </Box>
      </Box>
      <SettingsDrawer
        id={id}
        isOpen={isOpen}
        onClose={onClose}
        graphType={graphType}
        setGraphType={setGraphType}
        candlestickSupported={candlestickSupported}
        xValue={xValue}
        yValues={yValues}
        setYValue={setYValue}
        setDataKey={setDataKey}
        setTransformedData={setTransformedData}
        rawData={rawData}
      />
    </>
  );
});
