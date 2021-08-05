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

import { Outputs } from 'containers/Board/Canvas/index.types';

import StatCard from './Stats/StatCard';

const ResultsDrawer = (
  { isOpen, onClose, outputs }:
  { isOpen: boolean, onClose: () => void, outputs: Outputs },
) => {
  const btnRef = useRef();

  const renderStatCards = () => {
    const response = [];
    if (!('results' in outputs)) {
      return <></>;
    }

    for (const card of outputs.results.cards) {
      response.push(
        <StatCard
          key={0}
          data={{
            label: card.label,
            value: card.value,
            type: card.type,
          }}
          onClose={onClose}
        />,
      );
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
