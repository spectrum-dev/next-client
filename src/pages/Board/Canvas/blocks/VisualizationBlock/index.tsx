import {
  memo, useState, useContext, useEffect, ReactNode,
} from 'react';

import {
  Box,
  Flex,
  Text,
  Spacer,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';

import styled from '@emotion/styled';

import { BsGear } from 'react-icons/bs';
import { GiExpand } from 'react-icons/gi';

import { Handle as RawHandle, Position, NodeProps } from 'react-flow-renderer';

// Utils
import { formatBlockTypeHeader } from 'app/utils';

// Contexts
import CanvasContext from 'app/contexts/canvas';

// Visualizations
import LineGraph from 'components/Graphs/LineGraph';
import CandlestickGraph from 'components/Graphs/CandlestickGraph';
import Table from 'components/Tables/Table';

// Types
import { VisualizationType } from 'pages/Board/Canvas/index.types';

// Hooks
import useVisualizationData from './visualizations/useVisualizationData';
import useGraphTypeValidation from './visualizations/useGraphTypeValidation';

// Drawer
import SettingsDrawer from './SettingsDrawer';
import VisualizationDrawer from './VisualizationDrawer';

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
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

  const {
    isOpen: isVisualizationOpen,
    onOpen: onVisualizationOpen,
    onClose: onVisualizationClose,
  } = useDisclosure();

  const [transformedData, setTransformedData] = useState(rawData);

  useEffect(() => {
    setTransformedData(rawData);
  }, [rawData]);

  const { inputs, setInputs } = useContext(CanvasContext);

  const [graphType, setGraphType] = useState<VisualizationType>(
    inputs?.[id]?.graphType || VisualizationType.Line,
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
      setDataKeys(inputs?.[id]?.dataKeys || tempDataKeys);

      const loadedDataKey = inputs?.[id].dataKey || tempDataKeys[0];
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
  } = useVisualizationData({
    rawData: transformedData,
    xValue,
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
            // @ts-ignore
            data={data}
            disableInteraction
            xValue={xValue}
            yValue={inputs?.[id]?.yValue}
            fontSize={20}
            margin={{
              left: 0, right: 90, top: 10, bottom: 25,
            }}
          />
        );
      case VisualizationType.Candlestick:
        return (
          <CandlestickGraph
            // @ts-ignore
            data={data}
            disableInteraction
            xValue={xValue}
            fontSize={20}
            margin={{
              left: 0, right: 90, top: 10, bottom: 25,
            }}
          />
        );
      case VisualizationType.DataTable:
        return (
          <Table
            data={rawData}
          />
        );
      default:
        return (
          <></>
        );
    }
  };

  const title = formatBlockTypeHeader(id);

  return (
    <Flex
      direction="column"
      p="6"
      width="1300px"
      height="800px"
      rounded="8px"
      shadow="base"
      bg="#E6E6E6"
      textAlign="center"
    >
      <Flex>
        <Box w="10px" marginTop="-10px" marginLeft="-10px">
          <IconButton aria-label="Edit" align="flex-end" icon={<GiExpand />} rounded="full" size="md" fontSize="30px" background="#E6E6E6" onClick={onVisualizationOpen} />
        </Box>
        <Spacer />

        <Box marginLeft="10px">
          <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
            { title }
          </Text>
        </Box>
        <Spacer />
        <Box w="30px" marginTop="-15px">
          <IconButton aria-label="Edit" icon={<BsGear />} rounded="full" size="lg" fontSize="30px" background="#E6E6E6" onClick={onSettingsOpen} />
        </Box>
      </Flex>

      <Handle
        type="target"
        position={Position.Left}
        id={`input_${id}`}
        onConnect={() => null}
        isValidConnection={() => true}
      />
      <Box flex="1" width="100%" height="100%">
        {
          hasGraphTypeValidationError || hasVisualizationDataError
            ? (
              <Text>
                There was an error rendering the graph
              </Text>
            ) : renderGraph()
        }
      </Box>
      <SettingsDrawer
        id={id}
        isOpen={isSettingsOpen}
        onClose={onSettingsClose}
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
      <VisualizationDrawer
        isOpen={isVisualizationOpen}
        onClose={onVisualizationClose}
        title={title}
        data={data}
        xValue={xValue}
        yValue={inputs?.[id]?.yValue}
        graphType={graphType}
      />
    </Flex>
  );
});
