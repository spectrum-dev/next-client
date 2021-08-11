/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, ReactNode } from 'react';

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

// Line Graph
import LineGraph from 'components/Graphs/LineGraph';
import CandlestickGraph from 'components/Graphs/CandlestickGraph';

// Types
import { VisualizationType } from './visualizations/useGraphTypeValidation';

const VisualizationDrawer = (
  {
    isOpen, onClose, title, data, xValue, yValue, graphType,
  }:
  {
    isOpen: boolean,
    onClose: () => void,
    title: string,
    data: any,
    xValue: string,
    yValue: string,
    graphType: VisualizationType,
  },
) => {
  const btnRef: React.RefObject<any> = useRef();

  const renderGraph = (): ReactNode => {
    switch (graphType) {
      case VisualizationType.Line:
        return (
          <LineGraph
            // @ts-ignore
            data={data}
            xValue={xValue}
            yValue={yValue}
            fontSize={10}
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
            xValue={xValue}
            fontSize={10}
            margin={{
              left: 0, right: 50, top: 0, bottom: 25,
            }}
          />
        );
      default:
        return (
          <></>
        );
    }
  };
  return (
    <div className="nowheel">
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onClose}
        size="full"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent backgroundColor="#212838">
          <DrawerCloseButton textColor="white" />
          <DrawerHeader fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide" textColor="grey" textAlign="center">
            { title }
          </DrawerHeader>

          <DrawerBody>
            <Box flex="1" width="100%" height="100%">
              { renderGraph() }
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default VisualizationDrawer;
