import {
  Box, Flex, Text,
} from '@chakra-ui/react';

// Types
import { ResultsGraphDataRecord } from 'containers/Board/Canvas/index.types';

import LineGraph from './LineGraph';

const Graph = ({ data }: { data: ResultsGraphDataRecord }) => (
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
          xLabel={data.xLabel}
          yLabel={data.yLabel}
        />
      </Box>
    </Box>
  </Flex>
);

export default Graph;
