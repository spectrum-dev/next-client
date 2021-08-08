import { useRef } from 'react';

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
} from '@chakra-ui/react';

const SettingsDrawer = (
  { isOpen, onClose, renderedInputFields }:
  { isOpen: boolean, onClose: () => void, renderedInputFields: Array<React.ReactNode> },
) => {
  const btnRef = useRef();

  return (
    <div className="nowheel">
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
              { renderedInputFields }
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SettingsDrawer;
