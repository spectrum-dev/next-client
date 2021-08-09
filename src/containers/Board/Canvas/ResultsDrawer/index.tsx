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
import Graph from './Graph';

const ResultsDrawer = (
  { isOpen, onClose, outputs }:
  { isOpen: boolean, onClose: () => void, outputs: Outputs },
) => {
  const btnRef: React.RefObject<any> = useRef();

  const renderStatCards = () => {
    const response = [];
    if (!('results' in outputs)) {
      return <></>;
    }

    for (const card of outputs.results.cards) {
      response.push(
        <StatCard
          key={`key-${card.label}`}
          data={{
            label: card.label,
            value: card.value,
            type: card.type,
          }}
          onClose={onClose}
        />,
      );
    }
    return response;
  };

  const renderGraphCards = () => {
    if (!('results' in outputs)) {
      return <></>;
    }

    const response = [];
    for (const graph of outputs.results.graphs) {
      response.push(
        <Graph
          data={graph}
        />,
      );
    }
    return response;
  };

  return (
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
        <DrawerHeader textColor="white" textAlign="center">
          Strategy Results
        </DrawerHeader>

        <DrawerBody overflow="scroll" textColor="white" justifyContent="center" minWidth={900}>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacing="6"
          >
            { renderStatCards() }
          </SimpleGrid>
          <SimpleGrid
            columns={{ base: 1, md: 1, lg: 1 }}
            spacing="6"
            marginTop="50px"
          >
            { renderGraphCards() }
          </SimpleGrid>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ResultsDrawer;
