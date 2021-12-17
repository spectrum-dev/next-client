import { ReactNode } from 'react';

import { Box, Flex, Text } from '@chakra-ui/react';

import { RiCloseLine } from 'react-icons/ri';

const GenericSidebar = ({ title, onClose, children }: { title: string, onClose: () => void, children: ReactNode }) => {    
  return (
    <Box>
        <Flex
            margin="1rem 2rem"
            flexDirection="row"
            justifyContent="flex-end"
        >
            <Box marginRight="auto">
                <Text fontSize="2xl" fontWeight="500" align="left">
                    {title}
                </Text>
            </Box>
            <Flex
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                align="right"
                _hover={{ color: '#4262FF' }}
            >
                <RiCloseLine size={30} onClick={onClose}/>
            </Flex>
        </Flex>

        <Box margin="1rem 2rem">
            {children}
        </Box>
    </Box>
  );
};

export default GenericSidebar;