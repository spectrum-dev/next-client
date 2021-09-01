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

import { GiExpand } from 'react-icons/gi';

// Contexts
import BoardContext from 'app/contexts/board';

// Graphs
import Table from 'components/Tables/Table';

// Drawer
import VisualizationDrawer from './VisualizationDrawer';

interface ResultsTableBlockProps {
  data: {
    label: string;
  }
}

const ResultTableBlock = memo((
  { data }: ResultsTableBlockProps,
) => {
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [displayData, setDisplayData] = useState<any>([]);
  const { outputs } = useContext(BoardContext);

  const findResults = () => {
    if (!('results' in outputs)) {
      return;
    }

    for (const tableData of outputs.results.tables) {
      if (tableData.title === data.label) {
        setDisplayData(tableData.data);
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
        p="6"
        bg="gray.700"
        rounded="8px"
        shadow="base"
        color="gray.400"
        width="1300px"
        height="800px"
      >
        <Flex>
          <Box w="10px" marginTop="-10px" marginLeft="-10px">
            <IconButton aria-label="Edit" align="flex-end" icon={<GiExpand />} rounded="full" size="md" fontSize="30px" textColor="white" background="gray.700" onClick={onOpen} />
          </Box>
          <Spacer />

          <Box marginLeft="10px">
            <Text fontSize="2xl" fontWeight="bold" textTransform="uppercase" letterSpacing="wide">
              { data.label }
            </Text>
          </Box>
          <Spacer />
        </Flex>
        <Box flex="1" width="100%" height="100%">
          <Table
            data={displayData}
            backgroundColor="#2D3748"
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

export default ResultTableBlock;
