import { useRef } from 'react';

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

// Table
import Table from 'components/Tables/Table';

const VisualizationDrawer = (
  {
    isOpen, onClose, title, data,
  }:
  { isOpen: boolean, onClose: () => void, title: string, data: any },
) => {
  const btnRef: React.RefObject<any> = useRef();

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
              <Table
                data={data}
                backgroundColor="#2D3748"
              />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default VisualizationDrawer;
