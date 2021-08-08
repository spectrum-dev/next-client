/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box, Flex, Text,
} from '@chakra-ui/react';

import LineGraph from './LineGraph';

// Types

interface ResultsGraphData {
  title: string;
  data: Array<{
    timestamp: string;
    value: number;
  }>
}

const Graph = ({ data }: { data: ResultsGraphData }) => (
  <Flex
    direction="column"
    align="center"
    p="6"
    bg="gray.700"
    rounded="8px"
    height="400px"
    shadow="base"
    color="gray.400"
    textAlign="center"
    draggable
  >
    <Box>
      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
        {data.title}
      </Text>
      <Box>
        <LineGraph
            // @ts-ignore
          data={data.data}
        />
      </Box>
    </Box>
  </Flex>
);

export default Graph;
