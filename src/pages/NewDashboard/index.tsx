import { Box, Flex } from '@chakra-ui/react';

import { Dashboard as DashboardPane } from './Dashboard';
import Sidebar from './Sidebar';

const Dashboard = () => {
  return (
    <>
        <Sidebar />
        <Flex width="calc(100vw - 85px)" minWidth="calc(100vw - 85px)" marginLeft="85px" overflow="hidden" height="100vh" minHeight="100vh" backgroundColor="#FCFDFF">
            <Box minWidth="100%" width="100%">
                <DashboardPane />
            </Box>
        </Flex>
    </>
  );
};

export default Dashboard;
