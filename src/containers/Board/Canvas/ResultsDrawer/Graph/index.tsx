/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box, Flex, Text,
} from '@chakra-ui/react';

// Types
import { ResultsGraphDataRecord } from 'containers/Board/Canvas/index.types';

import LineGraph from 'components/Graphs/LineGraph';

const Graph = ({ data, onClose }: { data: ResultsGraphDataRecord, onClose: () => void }) => {
  const onDrag = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.dataTransfer.setData('application/reactflow-flow-block-type', 'resultGraphBlock');
    event.dataTransfer.setData('application/reactflow-data-label', data.title);
  };

  return (
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
      onDragStart={(event) => {
        onDrag(event);
        onClose();
      }}
    >
      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
        {data.title}
      </Text>
      <Box flex="1" width="100%" height="100%">
        <LineGraph
          // @ts-ignore
          data={data.data}
          disableInteraction
        />
      </Box>
    </Flex>
  );
};

export default Graph;
