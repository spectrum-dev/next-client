import {
  memo, useContext, useEffect, useState,
} from 'react';

import {
  Flex,
  Box,
  Spacer,
  Text,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';

import { BsGear } from 'react-icons/bs';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { Outputs } from 'containers/Board/Canvas/index.types';

// Graphs
import LineGraph from 'components/Graphs/LineGraph';

// Drawer
import VisualizationDrawer from './VisualizationDrawer';

interface ResultsGraphBlockProps {
  data: {
    label: string;
  }
}

const ResultGraphBlock = memo((
  { data }: ResultsGraphBlockProps,
) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [displayData, setDisplayData] = useState<any>([]);
  // @ts-ignore
  const { outputs } = useContext<{ outputs: Outputs }>(BoardContext);

  const findResults = () => {
    if (!('results' in outputs)) {
      return;
    }

    for (const graphData of outputs.results.graphs) {
      if (graphData.title === data.label) {
        setDisplayData(graphData.data);
      }
    }
  };

  useEffect(() => {
    findResults();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputs]);

  return (
    <>
      <Flex
        direction="column"
        align="center"
        p="6"
        bg="gray.700"
        rounded="8px"
        shadow="base"
        color="gray.400"
        textAlign="center"
        width="1300px"
        height="800px"
      >
        <Flex margin="10px 0px 0px 0px">
          <IconButton aria-label="Edit" icon={<BsGear />} rounded="full" size="lg" fontSize="40px" textColor="white" background="#1a202c" onClick={onOpen} style={{ textAlign: 'left' }} />
          <Spacer />
          <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
            { data.label }
          </Text>
          <Spacer />
        </Flex>
        <Box flex="1" width="100%" height="100%">
          <LineGraph
            // @ts-ignore
            data={displayData}
            fontSize={20}
            margin={{
              left: 0, right: 90, top: 10, bottom: 40,
            }}
            disableInteraction
          />
        </Box>
      </Flex>
      <VisualizationDrawer
        isOpen={isOpen}
        onClose={onClose}
        title={data.label}
        data={displayData}
      />
    </>
  );
});

export default ResultGraphBlock;
