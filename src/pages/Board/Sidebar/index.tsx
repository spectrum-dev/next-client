import { useContext } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

import { RiCloseLine } from 'react-icons/ri';

import BoardContext from 'app/contexts/board';

const Sidebar = () => {
  const { onRunClose } = useContext(BoardContext);
    
  return (
    <Flex
        margin="1rem 2rem"
        flexDirection="row"
        justifyContent="flex-end"
    >
        <Box marginRight="auto">
            <Text fontSize="2xl" fontWeight="500" align="left"> Backtest </Text>
        </Box>
        <Flex
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            align="right"
            _hover={{ color: '#4262FF' }}
        >
            <RiCloseLine size={30} onClick={onRunClose}/>
        </Flex>
    </Flex>
  );
};

export default Sidebar;