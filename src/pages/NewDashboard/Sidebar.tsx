import { Box, Flex } from '@chakra-ui/react';
import { RiDashboard2Line, RiFlaskLine, RiLoginCircleLine, RiSettings2Line, RiBookLine } from 'react-icons/ri';

import { ReactComponent as Logo } from './black-logo.svg';

const Divider = () => (
    <Box borderBottomWidth="1px" borderBottomStyle="solid" borderBottomColor="#e7e9f3" minWidth="100%" />
);

const Sidebar = () => (
    <Box position="fixed" left="0px" top="0px" height="100%" width="85px" backgroundColor="white" boxSizing="border-box" zIndex="30" borderRightWidth="1px" borderRightStyle="solid" borderRightColor="#e7e9f3">
        <Flex borderBottomWidth="1px" borderBottomStyle="solid" borderBottomColor="#e7e9f3" justifyContent="center" alignItems="center">
            <Logo style={{ width: '10rem', height: '5rem', padding: '0.7rem' }} />
        </Flex>

        <Flex justifyContent="center" alignItems="center" flexDirection="column" justify="space-between" marginTop="1.5rem">
            <Box marginTop="1.5rem" marginBottom="1.5rem">
                <RiDashboard2Line size={28} color="#9D9DBF" />
            </Box>

            <Box marginTop="1.5rem" marginBottom="1.5rem">
                <RiFlaskLine size={28} color="#9D9DBF"/>
            </Box>
        </Flex>

        <Flex justifyContent="center" alignItems="center" bottom="0px" position="absolute" width="100%" borderTopWidth="1px" borderRightStyle="solid" borderRightColor="#e7e9f3" flexDirection="column">
            <Box marginTop="1.5rem" marginBottom="1.5rem">
                <RiBookLine size={28} color="#9D9DBF" />
            </Box>
            
            <Divider />

            <Box marginTop="1.5rem" marginBottom="1.5rem">
                <RiSettings2Line size={28} color="#9D9DBF" />
            </Box>

            <Divider />

            <Box marginTop="1.5rem" marginBottom="1.5rem">
                <RiLoginCircleLine size={28} color="#9D9DBF" />
            </Box>
        </Flex>
    </Box>
);

export default Sidebar;
