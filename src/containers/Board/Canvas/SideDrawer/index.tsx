import { useRef } from 'react';
import {
  Heading,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
} from '@chakra-ui/react';

import GenericBlock from './GenericBlock';

const SideDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const btnRef = useRef();

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        // @ts-ignore
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Drag a block</DrawerHeader>

          <DrawerBody overflow="scroll">
            <Heading as="h4" size="md">
              Block Type
            </Heading>
            <GenericBlock onDrag={onClose} />
            <Divider />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
