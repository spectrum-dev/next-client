import { Box, Flex } from '@chakra-ui/react';

import { ReactComponent as Logo } from './black-logo.svg';

const Sidebar = () => (
    <Box position="fixed" left="0px" top="0px" height="100%" width="85px" backgroundColor="white" boxSizing="border-box" zIndex="30" borderRightWidth="1px" borderRightStyle="solid" borderRightColor="#e7e9f3">
        <Flex borderBottomWidth="1px" borderBottomStyle="solid" borderBottomColor="#e7e9f3" justifyContent="center" alignItems="center">
            <Logo style={{ width: '10rem', height: '5rem', padding: '0.5rem' }} />
        </Flex>
    </Box>
);

const Dashboard = () => {
  return (
    <>
        <Sidebar />
    </>
  );
};

export default Dashboard;
