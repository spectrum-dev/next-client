import { useState, useEffect } from 'react';
import {
  Box, Flex, Text,
} from '@chakra-ui/react';

import DataTable from 'react-data-table-component';

// Types
import { ResultsTableDataRecord } from 'containers/Board/Canvas/index.types';

const Table = ({ data }: { data: ResultsTableDataRecord }) => {
  const [columns, setColumns] = useState<Array<{
    name: string
    selector: string,
    sortable: boolean
  }>>([]);

  const renderColumns = () => {
    const updatedColumns = [];
    if (data.data.length > 0) {
      for (const elem of Object.keys(data.data[0])) {
        if (elem === 'date') {
          updatedColumns.push({
            name: elem,
            selector: elem,
            sortable: true,
            grow: 2,
          });
        } else {
          updatedColumns.push({
            name: elem,
            selector: elem,
            sortable: true,
          });
        }
      }
    }
    setColumns(updatedColumns);
  };

  useEffect(() => {
    renderColumns();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
    >
      <Box>
        <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
          {data.title}
        </Text>
        <Box marginTop="20px">
          <DataTable
            columns={columns}
            data={data.data}
          />
        </Box>
      </Box>
    </Flex>
  );
};

export default Table;
