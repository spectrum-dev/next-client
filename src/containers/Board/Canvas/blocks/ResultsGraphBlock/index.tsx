import {
  memo, useContext, useEffect, useState,
} from 'react';

import {
  Box,
  Text,
} from '@chakra-ui/react';

// Contexts
import BoardContext from 'app/contexts/board';

// Types
import { Outputs } from 'containers/Board/Canvas/index.types';

// Graphs
import LineGraph from './LineGraph';

interface ResultsGraphBlockProps {
  data: {
    label: string;
  }
}

const ResultGraphBlock = memo((
  { data }: ResultsGraphBlockProps,
) => {
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
      <Box
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
        <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
          { data.label }
        </Text>
        <LineGraph
          data={displayData}
          height={730}
          width={1250}
          ratio={1.0}
        />
      </Box>
    </>
  );
});

export default ResultGraphBlock;
