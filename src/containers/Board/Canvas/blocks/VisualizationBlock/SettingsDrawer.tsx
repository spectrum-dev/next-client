import { useContext, useRef } from 'react';

import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Box,
  FormLabel,
} from '@chakra-ui/react';

// Contexts
import BoardContext from 'app/contexts/board';

// Custom UI
import Dropdown from 'components/Dropdown';

import { VisualizationType } from 'containers/Board/Canvas/index.types';

const SideDrawer = (
  {
    id,
    isOpen,
    onClose,
    graphType,
    setGraphType,
    candlestickSupported,
    xValue,
    yValues,
    setYValue,
    setDataKey,
    setTransformedData,
    rawData,
  }:
  {
    id: string,
    isOpen: boolean,
    onClose: () => void,
    graphType: VisualizationType,
    setGraphType: Function,
    candlestickSupported: boolean,
    xValue: string,
    yValues: Array<string>,
    setYValue: Function,
    setDataKey: Function,
    setTransformedData: Function,
    rawData: any,
  },
) => {
  const btnRef = useRef();
  const { inputs } = useContext(BoardContext);

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      // @ts-ignore
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent backgroundColor="#212838" margin="30px 20px 30px 0px" borderRadius="20px">
        <DrawerCloseButton textColor="white" />
        <DrawerHeader textColor="white" borderBottomWidth="1px">
          Configure Block
        </DrawerHeader>

        <DrawerBody overflow="scroll" textColor="white" justifyContent="center">
          <Stack spacing="24px">
            <Box>
              <FormLabel htmlFor="visualizationType">
                Visualization Type
              </FormLabel>
              <Dropdown
                options={
                    candlestickSupported ? [
                      VisualizationType.Line,
                      VisualizationType.Candlestick,
                      VisualizationType.DataTable,
                    ] : [
                      VisualizationType.Line,
                      VisualizationType.DataTable,
                    ]
                  }
                value={graphType}
                onChange={(selectedItem) => {
                  setGraphType(selectedItem.value);
                }}
              />
            </Box>

            {
                inputs?.[id].dataKeys ? (
                  <Box>
                    <FormLabel textColor="white" fontSize="20px">
                      Data Key
                    </FormLabel>
                    <Dropdown
                      options={inputs?.[id].dataKeys}
                      value={inputs?.[id].dataKey}
                      onChange={(selectedItem) => {
                        setDataKey(selectedItem.value);
                        setTransformedData(rawData[selectedItem.value]);
                      }}
                    />
                  </Box>
                ) : <></>
            }
            {
              graphType === VisualizationType.Line ? (
                <>
                  <Box>
                    <FormLabel htmlFor="visualizationType">
                      X Value
                    </FormLabel>
                    <Dropdown
                      options={[xValue]}
                      value={xValue}
                      onChange={() => undefined}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="visualizationType">
                      Y Value
                    </FormLabel>
                    <Dropdown
                      options={yValues}
                      value={inputs?.[id].yValue}
                      onChange={(selectedItem) => setYValue(selectedItem.value)}
                    />
                  </Box>
                </>
              ) : <></>
            }
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SideDrawer;
