import {
  Box, Flex, Text,
} from '@chakra-ui/react';

import DataTable from 'components/Tables/Table';

// Types
import { ResultsTableDataRecord } from 'containers/Board/Canvas/index.types';

const Table = ({ data, onClose }: { data: ResultsTableDataRecord, onClose: () => void }) => {
  const onDrag = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.dataTransfer.setData('application/reactflow-flow-block-type', 'resultTableBlock');
    event.dataTransfer.setData('application/reactflow-data-label', data.title);
  };

  return (
    <Flex
      direction="column"
      align="center"
      p="6"
      bg="gray.700"
      rounded="8px"
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
      <Box marginTop="20px" flex="1" width="100%" height="100%">
        <DataTable
          data={data.data}
          headSize={12}
          cellSize={15}
          paginationSize={10}
        />
      </Box>
    </Flex>
  );
};

export default Table;
