import { Box } from '@chakra-ui/react';
import { TableContent } from './TableContent';

// Hooks
import useDataTable from './useDataTable';

const DataTable = ({ data }: { data: any }) => {
  const { columns, tableData } = useDataTable({ data });

  return (
    <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ base: '6', md: '8' }}>
      <Box overflowX="auto">
        <TableContent columns={columns} data={tableData} />
      </Box>
    </Box>
  );
};

export default DataTable;
