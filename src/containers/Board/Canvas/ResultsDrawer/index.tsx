import { useRef } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  SimpleGrid,
} from '@chakra-ui/react';

import StatCard from './Stats/StatCard';

const ResultsDrawer = (
  { isOpen, onClose, outputs }:
  { isOpen: boolean, onClose: () => void, outputs: any },
) => {
  const btnRef = useRef();

  const renderStatCards = () => {
    const response = [];
    if (outputs?.results?.cards) {
      for (const card of outputs?.results?.cards) {
        response.push(
          <StatCard
            key={0}
            data={{
              label: card.label,
              value: card.value,
              type: card.type,
            }}
          />,
        );
      }
    }
    return response;
  };

  return (
    <Drawer
      isOpen={isOpen}
      placement="bottom"
      onClose={onClose}
      size="full"
      // @ts-ignore
      finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent backgroundColor="#212838">
        <DrawerCloseButton textColor="white" />
        <DrawerHeader textColor="white" textAlign="center">
          Strategy Results
        </DrawerHeader>

        <DrawerBody overflow="scroll" textColor="white" justifyContent="center">
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing="6"
          >
            { renderStatCards() }
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ResultsDrawer;
